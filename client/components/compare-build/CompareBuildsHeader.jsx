'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

/* ── Keyframes injected once ─────────────────────────────────── */
const STYLES = `
  @keyframes cbh-grid-drift {
    0%   { background-position: 0px 0px; }
    100% { background-position: 48px 48px; }
  }
  @keyframes cbh-scanline {
    0%   { transform: translateY(-8px); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateY(160px); opacity: 0; }
  }
  @keyframes cbh-pulse-ring {
    0%   { transform: scale(1);   opacity: 0.9; }
    100% { transform: scale(2.8); opacity: 0; }
  }
  @keyframes cbh-dot-blink {
    0%, 80%, 100% { opacity: 1; }
    85%            { opacity: 0.15; }
  }
  @keyframes cbh-flicker {
    0%, 89%, 91%, 93%, 100% { opacity: 1; }
    90%  { opacity: 0.55; }
    92%  { opacity: 0.85; }
  }
  @keyframes cbh-glitch-a {
    0%,100%{ clip-path:inset(0 0 98% 0); transform:translateX(0); }
    10%    { clip-path:inset(12% 0 72% 0); transform:translateX(-5px); }
    20%    { clip-path:inset(55% 0 28% 0); transform:translateX(4px); }
    30%    { clip-path:inset(82% 0 8%  0); transform:translateX(-3px); }
    40%    { clip-path:inset(35% 0 45% 0); transform:translateX(6px); }
    50%    { clip-path:inset(68% 0 18% 0); transform:translateX(-4px); }
    60%    { clip-path:inset(8%  0 88% 0); transform:translateX(3px); }
    70%    { clip-path:inset(46% 0 40% 0); transform:translateX(-5px); }
    80%    { clip-path:inset(91% 0 2%  0); transform:translateX(4px); }
    90%    { clip-path:inset(22% 0 65% 0); transform:translateX(-2px); }
  }
  @keyframes cbh-glitch-b {
    0%,100%{ clip-path:inset(0 0 98% 0); transform:translateX(0); }
    10%    { clip-path:inset(70% 0 18% 0); transform:translateX(5px); }
    20%    { clip-path:inset(25% 0 55% 0); transform:translateX(-4px); }
    30%    { clip-path:inset(5%  0 87% 0); transform:translateX(3px); }
    40%    { clip-path:inset(58% 0 30% 0); transform:translateX(-6px); }
    50%    { clip-path:inset(14% 0 78% 0); transform:translateX(4px); }
    60%    { clip-path:inset(88% 0 4%  0); transform:translateX(-3px); }
    70%    { clip-path:inset(38% 0 50% 0); transform:translateX(5px); }
    80%    { clip-path:inset(62% 0 22% 0); transform:translateX(-4px); }
    90%    { clip-path:inset(3%  0 93% 0); transform:translateX(2px); }
  }
  @keyframes cbh-reveal-bar {
    from { scaleX: 0; }
    to   { scaleX: 1; }
  }
  @keyframes cbh-counter {
    from { opacity: 0; letter-spacing: 0.3em; }
    to   { opacity: 1; letter-spacing: 0.14em; }
  }
  .cbh-glitch-wrap {
    position: relative;
    display: inline-block;
    animation: cbh-flicker 8s infinite;
  }
  .cbh-glitch-wrap .cbh-ghost-a,
  .cbh-glitch-wrap .cbh-ghost-b {
    position: absolute;
    inset: 0;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    font: inherit;
    letter-spacing: inherit;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
  }
  .cbh-glitch-wrap .cbh-ghost-a {
    background: var(--red);
    animation: cbh-glitch-a 5s infinite steps(1);
    animation-delay: 0.6s;
  }
  .cbh-glitch-wrap .cbh-ghost-b {
    background: var(--red-muted);
    animation: cbh-glitch-b 5s infinite steps(1);
    animation-delay: 1.1s;
    transform: translateX(2px);
  }
`

/* ── Tiny HUD bracket ────────────────────────────────────────── */
function Corner({ pos }) {
  const s = {
    position: 'absolute',
    width: 18,
    height: 18,
    ...(pos.includes('t') ? { top: 16 }    : { bottom: 16 }),
    ...(pos.includes('l') ? { left: 16 }   : { right: 16 }),
    borderTop:    pos.includes('t') ? '1px solid var(--red)' : 'none',
    borderBottom: pos.includes('b') ? '1px solid var(--border-strong)' : 'none',
    borderLeft:   pos.includes('l') ? '1px solid ' + (pos.includes('t') ? 'var(--red)' : 'var(--border-strong)') : 'none',
    borderRight:  pos.includes('r') ? '1px solid ' + (pos.includes('t') ? 'var(--red)' : 'var(--border-strong)') : 'none',
    opacity: pos.includes('t') ? 0.55 : 0.28,
  }
  return <div style={s} aria-hidden="true" />
}

/* ── Stat pill ───────────────────────────────────────────────── */
function StatPill({ label, value }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 10px', borderRadius: 4,
        background: 'rgba(255,59,31,0.05)',
        border: '1px solid var(--border)',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 9,
        color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
        color: 'var(--text-2)', letterSpacing: '0.1em',
      }}>
        {value}
      </span>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────────── */
export function CompareBuildsHeader({ buildCount = 0 }) {
  const prefersReduced = useReducedMotion()
  const [tick, setTick] = useState(false)

  // Clock tick for the live timestamp feel
  useEffect(() => {
    const id = setInterval(() => setTick(p => !p), 900)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--surface-2)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* ── Layer 1: scrolling grid ── */}
        {!prefersReduced && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: `
                linear-gradient(var(--border) 1px, transparent 1px),
                linear-gradient(90deg, var(--border) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              animation: 'cbh-grid-drift 12s linear infinite',
              opacity: 0.35,
            }}
          />
        )}

        {/* ── Layer 2: vignette ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, var(--surface-2) 100%),
              linear-gradient(180deg, transparent 55%, var(--bg) 100%)
            `,
          }}
        />

        {/* ── Layer 3: scanline sweep ── */}
        {!prefersReduced && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', left: 0, right: 0, top: 0,
              height: 8, pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(255,59,31,0.08) 0%, transparent 100%)',
              animation: 'cbh-scanline 4s ease-in-out infinite',
              animationDelay: '1.2s',
            }}
          />
        )}

        {/* ── Layer 4: bottom glow bar ── */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 1, transformOrigin: 'left',
            background: 'linear-gradient(90deg, transparent 0%, var(--red) 35%, var(--red) 65%, transparent 100%)',
            boxShadow: '0 0 18px var(--red-glow), 0 0 40px var(--red-glow)',
          }}
        />

        {/* ── HUD corners ── */}
        <Corner pos="tl" /><Corner pos="tr" />
        <Corner pos="bl" /><Corner pos="br" />

        {/* ── Content ── */}
        <div
          style={{
            position: 'relative', maxWidth: '80rem',
            margin: '0 auto', padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1rem,4vw,2rem) clamp(1.25rem,3vw,2rem)',
          }}
        >

          {/* ── Top status row ── */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.1 }}
            style={{
              display: 'flex', alignItems: 'center',
              flexWrap: 'wrap', gap: '0.75rem',
              marginBottom: '1.4rem',
            }}
          >
            {/* Live dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'var(--red)',
                  animation: 'cbh-dot-blink 2.2s ease-in-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'var(--red)', opacity: 0.4,
                  animation: 'cbh-pulse-ring 2.2s ease-out infinite',
                }} />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 10,
                color: 'var(--text-3)', letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                SYSTEM · ONLINE
              </span>
            </div>

            <div style={{ width: 1, height: 10, background: 'var(--border-strong)', flexShrink: 0 }} />

            <StatPill label="MODULE" value="BUILD.CMP" />
            <StatPill label="REV" value="v2.4.1" />
            <StatPill label="CAPACITY" value="4 / SLOT" />

            {/* right side */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 10,
                color: 'var(--text-3)', letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                {buildCount} UNIT{buildCount !== 1 ? 'S' : ''} LOADED
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: tick ? 'var(--red)' : 'var(--border-strong)',
                  transition: 'background 0.15s ease',
                  display: 'inline-block',
                }}
              />
            </div>
          </motion.div>

          {/* ── Title block ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '0.75rem' }}
          >
            {/* Eyebrow */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <div style={{ width: 20, height: 1, background: 'var(--red)', opacity: 0.7 }} />
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 9,
                color: 'var(--red)', letterSpacing: '0.22em',
                textTransform: 'uppercase', opacity: 0.8,
              }}>
                TACTICAL · BUILD · INTERFACE
              </span>
              <div style={{ width: 20, height: 1, background: 'var(--red)', opacity: 0.7 }} />
            </div>

            {/* Glitch title */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 5vw, 3.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              <span className="cbh-glitch-wrap">
                <span
                  aria-hidden="true"
                  className="cbh-ghost-a"
                  style={{ fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit' }}
                >
                  Compare Builds
                </span>
                <span
                  aria-hidden="true"
                  className="cbh-ghost-b"
                  style={{ fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit' }}
                >
                  Compare Builds
                </span>
                <span className="text-red-gradient" style={{ position: 'relative', zIndex: 1 }}>
                  Compare Builds
                </span>
              </span>
            </h1>
          </motion.div>

          {/* ── Subtitle + progress bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.26 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '0.8rem',
              color: 'var(--text-2)', margin: 0, letterSpacing: '0.01em',
            }}>
              Select up to 4 builds to compare side by side
            </p>

            {/* Slim capacity bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 9,
                color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                SLOT CAPACITY
              </span>
              <div style={{
                display: 'flex', gap: 3, alignItems: 'center',
              }}>
                {[0,1,2,3].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.07, ease: 'easeOut' }}
                    style={{
                      width: 24, height: 3, borderRadius: 2,
                      background: i < buildCount ? 'var(--red)' : 'var(--border-strong)',
                      transformOrigin: 'left',
                      boxShadow: i < buildCount ? '0 0 6px var(--red-glow)' : 'none',
                      transition: 'background 0.2s ease, box-shadow 0.2s ease',
                    }}
                  />
                ))}
              </div>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 9,
                color: 'var(--text-3)', letterSpacing: '0.1em',
              }}>
                {buildCount} / 4
              </span>
            </div>
          </motion.div>

        </div>
      </motion.header>
    </>
  )
}