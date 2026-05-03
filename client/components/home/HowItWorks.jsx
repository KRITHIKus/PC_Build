'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'
import { Target, Puzzle, GitCompare, BookmarkCheck } from 'lucide-react'
import { MotionSection } from '@/components/shared/MotionSection'

const STEPS = [
  {
    number: '01',
    icon:   Target,
    title:  'Choose Your Purpose',
    body:   'Tell us what you need — gaming, content creation, AI training, or everyday productivity.',
    color:  '#ff3b1f',
  },
  {
    number: '02',
    icon:   Puzzle,
    title:  'Pick Compatible Parts',
    body:   'Browse our live-priced component catalog. Compatibility is checked automatically as you build.',
    color:  '#ff5533',
  },
  {
    number: '03',
    icon:   GitCompare,
    title:  'Compare Builds',
    body:   'Put builds side-by-side to compare specs, performance benchmarks, and price-to-value ratios.',
    color:  '#e63e1f',
  },
  {
    number: '04',
    icon:   BookmarkCheck,
    title:  'Save Your Plan',
    body:   'Lock in your build, share it with others, or order parts when you are ready.',
    color:  '#cc2e25',
  },
]

/* ── Step icon with glow ring ───────────────────────────────── */
function StepIcon({ Icon, active, color }) {
  return (
    <div className="relative flex-shrink-0">
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: `radial-gradient(circle, ${color}33 0%, transparent 70%)` }}
        animate={active ? { scale: [1, 1.4, 1], opacity: [0, 0.6, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: 'easeOut' }}
      />

      {/* Icon container */}
      <motion.div
        className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: active ? `rgba(255,59,31,0.14)` : 'rgba(255,255,255,0.03)',
          border:     active ? `1px solid rgba(255,59,31,0.35)` : '1px solid rgba(255,255,255,0.07)',
          boxShadow:  active ? `0 0 20px ${color}33` : 'none',
        }}
        animate={active
          ? { scale: 1.05 }
          : { scale: 1 }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <Icon
          size={20}
          strokeWidth={1.8}
          style={{ color: active ? color : 'rgba(255,255,255,0.2)' }}
        />
      </motion.div>
    </div>
  )
}

/* ── Desktop step card ──────────────────────────────────────── */
function StepCard({ step, active, index }) {
  const { number, icon: Icon, title, body, color } = step

  return (
    <motion.div
      className="flex flex-col gap-4 flex-1"
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Number + icon */}
      <div className="flex items-center gap-4">
        <motion.span
          className="text-xs font-bold tracking-wider tabular-nums"
          style={{
            fontFamily: 'var(--font-display)',
            color:      active ? 'var(--red)' : 'rgba(255,255,255,0.15)',
          }}
          animate={active ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {number}
        </motion.span>

        <StepIcon Icon={Icon} active={active} color={color} />
      </div>

      {/* Text */}
      <div>
        <motion.h3
          className="text-base font-semibold mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            color:      active ? 'var(--text-1)' : 'rgba(255,255,255,0.25)',
          }}
          transition={{ duration: 0.35 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-sm leading-relaxed"
          style={{ color: active ? 'var(--text-2)' : 'rgba(255,255,255,0.12)' }}
          transition={{ duration: 0.35 }}
        >
          {body}
        </motion.p>
      </div>
    </motion.div>
  )
}

/* ── How It Works Section ───────────────────────────────────── */
export function HowItWorks() {
  const sectionRef    = useRef(null)
  const [activeStep, setActiveStep] = useState(-1)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start 85%', 'end 55%'],
  })

  // Smooth out the progress for the visual bar
  const smoothProgress  = useSpring(scrollYProgress, { stiffness: 55, damping: 20 })
  const progressPercent = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  // Update active step as user scrolls
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if      (v >= 0.82) setActiveStep(3)
    else if (v >= 0.55) setActiveStep(2)
    else if (v >= 0.28) setActiveStep(1)
    else if (v >= 0.08) setActiveStep(0)
    else                setActiveStep(-1)
  })

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Radial bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 60% at 50% 100%, rgba(255,59,31,0.055) 0%, transparent 65%)',
        }}
      />

      <div className="container-app relative">

        {/* Header */}
        <MotionSection direction="up" className="text-center mb-14 sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
          >
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
          >
            From idea to build<br />in four steps
          </h2>
          <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: 'var(--text-2)' }}>
            Our guided flow makes PC building approachable for anyone — no prior knowledge required.
          </p>
        </MotionSection>

        {/* ── Desktop: scroll-linked progress ─────────────── */}
        <div className="hidden lg:block">
          {/* Progress track */}
          <div className="relative mb-12">
            {/* Track base */}
            <div
              className="w-full h-px"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            {/* Animated fill */}
            <motion.div
              className="absolute top-0 left-0 h-px"
              style={{
                width:      progressPercent,
                background: 'linear-gradient(90deg, rgba(255,59,31,0.9) 0%, rgba(255,80,40,0.6) 100%)',
                boxShadow:  '0 0 8px rgba(255,59,31,0.6)',
              }}
            />
            {/* Step dots on track */}
            <div className="absolute top-0 left-0 right-0 flex justify-between transform -translate-y-1/2">
              {STEPS.map((step, i) => {
                const threshold = (i + 1) / STEPS.length
                const isDone    = activeStep >= i
                return (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full -mt-[1px]"
                    style={{
                      background: isDone ? 'var(--red)' : 'rgba(255,255,255,0.1)',
                      border:     isDone ? '1px solid rgba(255,59,31,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow:  isDone ? '0 0 10px rgba(255,59,31,0.6)' : 'none',
                    }}
                    animate={isDone ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )
              })}
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-start gap-6">
            {STEPS.map((step, i) => (
              <StepCard key={step.number} step={step} active={activeStep >= i} index={i} />
            ))}
          </div>
        </div>

        {/* ── Mobile: vertical stacked ─────────────────────── */}
        <div className="lg:hidden flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const { number, icon: Icon, title, body } = step
            return (
              <motion.div
                key={number}
                className="relative flex gap-5"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Vertical connector */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[22px] top-14 bottom-0 w-px"
                    style={{ background: 'linear-gradient(180deg, rgba(255,59,31,0.3) 0%, transparent 100%)' }}
                  />
                )}

                {/* Left side: number + icon */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--red)' }}>
                    {number}
                  </span>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,59,31,0.09)', border: '1px solid rgba(255,59,31,0.22)' }}
                  >
                    <Icon size={19} style={{ color: 'var(--red)' }} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Text */}
                <div className="pb-10 pt-1">
                  <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                    {body}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}