"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── Wireframe Room Canvas ─────────────────────────────────────────
function WireframeRoom() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);
  const lastRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      tRef.current += dt * 0.18; // very slow drift speed

      const T  = tRef.current;
      const W  = canvas.offsetWidth;
      const H  = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      // ── grid parameters ────────────────────────────────────────
      const cols    = 10;
      const rows    = 8;
      const fov     = 1.1;          // field of view factor
      const scrollZ = (T % 1);     // 0→1 looping Z scroll

      const vpx = W / 2;           // vanishing point x
      const vpy = H / 2;           // vanishing point y

      // near/far plane extents (as fraction of canvas)
      const nearW = W * 0.98;
      const nearH = H * 0.98;
      const farW  = W * 0.0;
      const farH  = H * 0.0;

      // line color — white/off-white like the reference image
      const lineBase = "rgba(200,200,205,";

      // ── draw grid layers (slices in Z) ─────────────────────────
      // We draw (rows+cols)*2 lines but parameterised over z ∈ [0,1]
      // z=0 → near (full canvas), z=1 → far (vanishing point)

      const lerp = (a, b, t) => a + (b - a) * t;

      // helper: interpolate a rect between near and vanishing point at depth z
      const rectAt = (z) => {
        return {
          x0: lerp(vpx - nearW / 2, vpx, z),
          x1: lerp(vpx + nearW / 2, vpx, z),
          y0: lerp(vpy - nearH / 2, vpy, z),
          y1: lerp(vpy + nearH / 2, vpy, z),
        };
      };

      // ── horizontal lines (floor + ceiling) ────────────────────
      for (let r = 0; r <= rows; r++) {
        // fraction along vertical (0 = top, 1 = bottom)
        const frac = r / rows;

        // draw this line at several depths so it scrolls
        for (let layer = 0; layer < 2; layer++) {
          let z = ((frac + scrollZ * 0.5 + layer * 0.5)) % 1;
          // alpha: strong near (z≈0), vanish far (z≈1)
          const alpha = (1 - z) * 0.55 + 0.04;
          const rZ = rectAt(z);

          // floor line: map frac 0→1 to bottom half
          const fy = lerp(vpy, rZ.y1, 1 - z);
          // ceiling line: mirror
          const cy = lerp(vpy, rZ.y0, 1 - z);

          ctx.strokeStyle = `${lineBase}${alpha.toFixed(3)})`;
          ctx.lineWidth   = 0.6;

          // floor
          ctx.beginPath();
          ctx.moveTo(rZ.x0, fy);
          ctx.lineTo(rZ.x1, fy);
          ctx.stroke();

          // ceiling
          ctx.beginPath();
          ctx.moveTo(rZ.x0, cy);
          ctx.lineTo(rZ.x1, cy);
          ctx.stroke();
        }
      }

      // ── vertical lines (left + right walls) ───────────────────
      for (let c = 0; c <= cols; c++) {
        const frac = c / cols;

        for (let layer = 0; layer < 2; layer++) {
          let z = ((frac + scrollZ * 0.5 + layer * 0.5)) % 1;
          const alpha = (1 - z) * 0.55 + 0.04;
          const rZ = rectAt(z);

          // left wall: map frac 0→1 to left half
          const lx = lerp(vpx, rZ.x0, 1 - z);
          // right wall: mirror
          const rx = lerp(vpx, rZ.x1, 1 - z);

          ctx.strokeStyle = `${lineBase}${alpha.toFixed(3)})`;
          ctx.lineWidth   = 0.6;

          // left wall column
          ctx.beginPath();
          ctx.moveTo(lx, rZ.y0);
          ctx.lineTo(lx, rZ.y1);
          ctx.stroke();

          // right wall column
          ctx.beginPath();
          ctx.moveTo(rx, rZ.y0);
          ctx.lineTo(rx, rZ.y1);
          ctx.stroke();
        }
      }

      // ── diagonal edges (room corners) ─────────────────────────
      // Connect canvas corners to vanishing point
      const corners = [
        { x: 0,  y: 0  },
        { x: W,  y: 0  },
        { x: W,  y: H  },
        { x: 0,  y: H  },
      ];
      corners.forEach(c => {
        ctx.strokeStyle = `${lineBase}0.22)`;
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(vpx, vpy);
        ctx.stroke();
      });

      // ── outer border rect ──────────────────────────────────────
      ctx.strokeStyle = `${lineBase}0.25)`;
      ctx.lineWidth   = 0.7;
      ctx.strokeRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ── Glitch text hook ──────────────────────────────────────────────
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&";
function useGlitch(text, active) {
  const [display, setDisplay] = useState(text);
  const rafRef  = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iter = 0;
    const total = 14;
    const step = () => {
      setDisplay(
        text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < iter) return ch;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }).join("")
      );
      iter += 0.5;
      if (iter < text.length + 2) {
        frameRef.current++;
        rafRef.current = setTimeout(step, 32);
      } else {
        setDisplay(text);
      }
    };
    step();
    return () => clearTimeout(rafRef.current);
  }, [active, text]);

  return display;
}

// ── Main Component ────────────────────────────────────────────────
export default function LearnHeader() {
  const [ready,   setReady]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const title   = useGlitch("KNOWLEDGE HUB", hovered);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className={`lh ${ready ? "lh--on" : ""}`}>

      {/* Wireframe background */}
      <div className="lh__bg">
        <WireframeRoom />
        {/* centre fade so content stays readable */}
        <div className="lh__fade" />
      </div>

      {/* Content */}
      <div className="lh__content">
        <p className="lh__label">— LEARN ·  v4.1 —</p>

        <h1
          className="lh__title"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {title}
          <span className="lh__cursor" aria-hidden="true">_</span>
        </h1>

        <p className="lh__quote">
          "Knowledge is the only instrument of production that is not subject to diminishing returns."
        </p>

        <div className="lh__divider" aria-hidden="true" />

        <p className="lh__meta">J.M. Clark · Structured articles on systems, silicon &amp; computation</p>
      </div>

      <style jsx>{`
        /* ── root ──────────────────────────────────────────────── */
        .lh {
          position: relative;
          width: 100%;
          height: clamp(320px, 46vh, 480px);
          overflow: hidden;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .lh--on { opacity: 1; }

        /* ── background ────────────────────────────────────────── */
        .lh__bg { position: absolute; inset: 0; }

        .lh__fade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          /* strong radial fade so centre is dark, edges show grid */
          background: radial-gradient(
            ellipse 65% 70% at 50% 50%,
            rgba(10,10,10,0.82) 0%,
            rgba(10,10,10,0.45) 55%,
            rgba(10,10,10,0.0)  100%
          );
        }

        /* ── content ────────────────────────────────────────────── */
        .lh__content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          padding: 0 20px;
          max-width: 680px;
          width: 100%;
        }

        /* label */
        .lh__label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.32em;
          color: rgba(255,59,31,0.55);
          text-transform: uppercase;
          margin: 0;
          opacity: 0;
          animation: lhUp 0.5s 0.2s forwards;
        }

        /* title */
        .lh__title {
          font-family: 'Courier New', monospace;
          font-size: clamp(2rem, 5.8vw, 4rem);
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-1, #f5f5f5);
          margin: 0;
          cursor: default;
          white-space: nowrap;
          opacity: 0;
          animation: lhUp 0.55s 0.32s forwards;
          transition: text-shadow 0.2s ease;
          user-select: none;
        }
        .lh__title:hover {
          text-shadow:
            0 0 8px rgba(255,59,31,0.35),
            0 0 2px rgba(255,255,255,0.15);
        }
        .lh__cursor {
          display: inline-block;
          color: var(--red, #ff3b1f);
          animation: blink 1.1s step-end infinite;
          margin-left: 2px;
          font-weight: 300;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* quote */
        .lh__quote {
          font-family: 'Courier New', monospace;
          font-size: clamp(0.62rem, 1.4vw, 0.74rem);
          line-height: 1.9;
          letter-spacing: 0.04em;
          color: rgba(200,200,205,0.48);
          max-width: 460px;
          margin: 0;
          font-style: italic;
          opacity: 0;
          animation: lhUp 0.55s 0.48s forwards;
        }

        /* divider */
        .lh__divider {
          width: 40px;
          height: 1px;
          background: rgba(255,59,31,0.3);
          opacity: 0;
          animation: lhUp 0.4s 0.58s forwards;
        }

        /* meta */
        .lh__meta {
          font-family: 'Courier New', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(200,200,205,0.28);
          margin: 0;
          opacity: 0;
          animation: lhUp 0.5s 0.66s forwards;
        }

        /* animations */
        @keyframes lhUp {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── responsive ──────────────────────────────────────────── */
        @media (max-width: 480px) {
          .lh__title { white-space: normal; word-break: break-word; }
        }
      `}</style>
    </header>
  );
}