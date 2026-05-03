'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cpu, Star } from 'lucide-react'

export function RecommendedHeader() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="relative py-14 sm:py-20 overflow-hidden">

      {/* Bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,59,31,0.09) 0%, transparent 70%)',
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      <div className="container-app relative text-center">

        {/* Eyebrow */}
      
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  className="flex justify-center mb-5"
>
  <span
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
    style={{
      background: 'rgba(255,59,31,0.1)',
      border:     '1px solid rgba(255,59,31,0.25)',
      color:      'var(--red)',
      fontFamily: 'var(--font-display)',
    }}
  >
    <Star size={15} fill="currentColor" />
    Expert Configured
  </span>
</motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block mb-4"
        >
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-none tracking-tight"
            style={{
              fontFamily:    'var(--font-display)',
              letterSpacing: '-0.03em',
              color:         'var(--text-1)',
            }}
          >
            Recommended{' '}
            <span style={{ color: 'var(--red)', textShadow: '0 0 40px rgba(255,59,31,0.4)' }}>
              Builds
            </span>
          </h1>

          {/* Animated red underline */}
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,59,31,0.7), rgba(255,59,31,0.5), transparent)',
              boxShadow: '0 0 10px rgba(255,59,31,0.4)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-2)' }}
        >
          Find the right system for your workload. Every build is configured for real-world performance with live pricing.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex items-center justify-center gap-6 mt-8 flex-wrap"
        >
          {[
            { label: 'Curated Builds', value: '50+' },
            { label: 'Price Checked', value: 'Live' },
            { label: 'Use Cases', value: '6' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--red)' }}
              >
                {value}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}