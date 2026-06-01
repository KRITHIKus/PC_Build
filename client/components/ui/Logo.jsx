'use client'

import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useRef, useEffect, useCallback } from 'react'
import { APP_NAME } from '@/lib/constants'

/* ─── tunables ───────────────────────────────────────────── */
const RED   = '#ff3b1f'
const CREAM = '#f0ece4'
const CYAN  = '#00dcff'

/* One glitch "burst": 4 quick keyframe ticks */
function useGlitch() {
  const ctrl = useAnimation()
  const fire = useCallback(async () => {
    await ctrl.start({
      opacity: [0, 1, 0, 0.85, 0, 0.6, 0],
      x:       [0, 3, -2,  3, -1,  2,  0],
      skewX:   [0, 2, -1,  2,  0,  0,  0],
      transition: { duration: 0.38, ease: 'linear' },
    })
  }, [ctrl])
  return { ctrl, fire }
}

/* ── Logo ──────────────────────────────────────────────────── */
export function Logo({ size = 'md', href = '/' }) {
  const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' }
  const textSize = sizes[size] || sizes.md

  /* px values that match Tailwind's text-xl / text-2xl / text-4xl */
  const pxMap   = { sm: 20, md: 24, lg: 36 }
  const px       = pxMap[size] || pxMap.md

  const glitchRed  = useGlitch()
  const glitchCyan = useGlitch()
  const shimmerCtrl = useAnimation()
  const scanCtrl    = useAnimation()
  const hovered     = useRef(false)

  /* repeating scanline flicker while hovered */
  useEffect(() => {
    let raf
    const loop = async () => {
      if (!hovered.current) return
      await scanCtrl.start({ opacity: [0, 0.18, 0, 0.12, 0], transition: { duration: 0.22, ease: 'linear' } })
      raf = setTimeout(loop, 90 + Math.random() * 180)
    }
    if (hovered.current) loop()
    return () => clearTimeout(raf)
  })

  const onEnter = async () => {
    hovered.current = true
    /* shimmer sweep */
    shimmerCtrl.start({ x: ['−130%', '130%'], transition: { duration: 0.7, ease: 'easeInOut' } })
    /* glitch bursts staggered */
    glitchRed.fire()
    setTimeout(() => glitchCyan.fire(), 60)
    /* scanline loop kick */
    scanCtrl.start({ opacity: [0, 0.18, 0, 0.12, 0], transition: { duration: 0.22, ease: 'linear' } })
  }

  const onLeave = () => {
    hovered.current = false
    scanCtrl.start({ opacity: 0, transition: { duration: 0.1 } })
  }

  const base = { fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }
  const ghost = `absolute inset-0 ${textSize} font-black tracking-tight leading-none pointer-events-none select-none`

  /* prefix / suffix split */
  const prefix = APP_NAME.slice(0, -3)   // "Build"
  const suffix = APP_NAME.slice(-3)       // "Lab"

  return (
    <Link
      href={href}
      aria-label={APP_NAME}
      className="group relative inline-block select-none outline-none"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/*
        ── outer glow ring — subtle "powered" halo around the whole logo
           expands on hover
      */}
      <motion.span
        className="absolute -inset-2 rounded pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,59,31,0.12) 0%, transparent 70%)' }}
        initial={{ opacity: 0.5, scale: 0.95 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative overflow-hidden" style={{ padding: '2px 0' }}>

        {/* ── Primary visible text ─────────────────────────────── */}
        <motion.h1
          className={`relative ${textSize} font-black tracking-tight leading-none`}
          style={base}
          initial={{ y: 0 }}
          whileHover={{ y: -0.5 }}
          transition={{ duration: 0.2 }}
        >
          {/* "Build" — white with fine scanline texture on hover */}
          <motion.span
            style={{ color: CREAM, display: 'inline-block', position: 'relative' }}
            whileHover={{ textShadow: `0 0 8px rgba(240,236,228,0.25), 0 0 1px rgba(240,236,228,0.6)` }}
            transition={{ duration: 0.3 }}
          >
            {prefix}
          </motion.span>

          {/*
            "Lab" — red, always-on ember glow, intensifies on hover.
            Also gets a tiny upward flick + scale nudge on hover.
          */}
          <motion.span
            style={{ color: RED, display: 'inline-block' }}
            animate={{
              textShadow: [
                `0 0 3px rgba(255,59,31,0.08)`,
                `0 0 16px rgba(255,59,31,0.55)`,
                `0 0 3px rgba(255,59,31,0.08)`,
              ],
            }}
            whileHover={{
              textShadow: [
                `0 0 6px rgba(255,59,31,0.5), 0 0 24px rgba(255,59,31,0.3)`,
                `0 0 12px rgba(255,59,31,0.9), 0 0 40px rgba(255,59,31,0.5)`,
                `0 0 6px rgba(255,59,31,0.5), 0 0 24px rgba(255,59,31,0.3)`,
              ],
              y: [0, -1.5, 0],
              transition: { duration: 0.35, repeat: 0 },
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {suffix}
          </motion.span>

          {/*
            ── Futuristic dot / version tag beside "Lab"
               Small "v2" superscript that glows with the red glow
          */}
          <motion.sup
            style={{
              fontSize: `${px * 0.28}px`,
              color: RED,
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.05em',
              opacity: 0.7,
              marginLeft: '1px',
              verticalAlign: 'super',
            }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            ™
          </motion.sup>
        </motion.h1>

        {/*
          ── Shimmer sweep ────────────────────────────────────────
          Single diagonal light flash on hover entry.
        */}
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%)`,
            mixBlendMode: 'screen',
            skewX: '-18deg',
          }}
          animate={shimmerCtrl}
          initial={{ x: '-130%' }}
        />

        {/*
          ── Scanline overlay — tight horizontal stripes that flicker ─
          CRT / terminal feel
        */}
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent ${px * 0.28}px)`,
            mixBlendMode: 'multiply',
          }}
          initial={{ opacity: 0 }}
          animate={scanCtrl}
        />

        {/*
          ── Red chromatic-split ghost ────────────────────────────
          Shifts right + skews during glitch burst.
        */}
        <motion.h1
          className={ghost}
          style={{ ...base, color: `rgba(255,59,31,0.75)` }}
          initial={{ opacity: 0 }}
          animate={glitchRed.ctrl}
        >
          {prefix}
          <span style={{ color: `rgba(255,59,31,0.75)` }}>{suffix}</span>
        </motion.h1>

        {/*
          ── Cyan chromatic-split ghost ───────────────────────────
          Shifts left, opposite direction — RGB-split effect.
          Cyan on a dark bg is subtle; keeps the palette dark-red-first.
        */}
        <motion.h1
          className={ghost}
          style={{ ...base, color: `rgba(0,220,255,0.32)` }}
          initial={{ opacity: 0 }}
          animate={glitchCyan.ctrl}
        >
          {prefix}
          <span style={{ color: `rgba(0,220,255,0.32)` }}>{suffix}</span>
        </motion.h1>

        {/*
          ── Pixel-row slice — 3 narrow strips that pop in/out ────
          Each strip clips a thin horizontal band and translates it
          a few px left/right to simulate digital pixel corruption.
        */}
        {[
          { top: '20%', h: `${px * 0.18}px`, x:  3, delay: 0.04 },
          { top: '55%', h: `${px * 0.14}px`, x: -4, delay: 0.10 },
          { top: '78%', h: `${px * 0.12}px`, x:  2, delay: 0.07 },
        ].map((slice, i) => (
          <motion.span
            key={i}
            className="absolute left-0 right-0 pointer-events-none overflow-hidden"
            style={{ top: slice.top, height: slice.h, mixBlendMode: 'screen' }}
            initial={{ opacity: 0, x: 0 }}
            whileHover={{
              opacity: [0, 0.9, 0, 0.7, 0],
              x:       [0, slice.x, -slice.x * 0.5, slice.x, 0],
              transition: { duration: 0.28, ease: 'linear', delay: slice.delay },
            }}
          >
            {/* re-render the text clipped by this strip's overflow */}
            <span
              className={`${textSize} font-black tracking-tight leading-none absolute`}
              style={{
                ...base,
                color: CREAM,
                top: `-${slice.top}`,      /* counteract the strip's top offset */
                left: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {prefix}<span style={{ color: RED }}>{suffix}</span>
            </span>
          </motion.span>
        ))}

        {/*
          ── Bottom accent rule — thin red line that grows on hover ─
          Terminal / HUD underline feel
        */}
        <motion.span
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{ height: '1px', background: `linear-gradient(90deg, ${RED}, transparent)` }}
          initial={{ width: '0%', opacity: 0.6 }}
          whileHover={{ width: '100%', opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />

      </div>
    </Link>
  )
}