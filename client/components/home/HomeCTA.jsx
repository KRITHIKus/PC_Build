'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { MotionSection } from '@/components/shared/MotionSection'

/* ── Pulsing orbit rings behind the CTA block ───────────────── */
function OrbitRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[280, 420, 560, 700].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border"
          style={{
            width:       size,
            height:      size,
            borderColor: `rgba(255,59,31,${0.12 - i * 0.025})`,
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.25, 0.6] }}
          transition={{
            duration:  3.5 + i * 0.8,
            delay:     i * 0.6,
            repeat:    Infinity,
            ease:      'easeInOut',
          }}
        />
      ))}
      {/* Center glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,59,31,0.14) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* ── Magnetic CTA button ─────────────────────────────────────── */
function CTAButton({ href, label, variant = 'primary', icon: Icon }) {
  const btnRef  = useRef(null)
  const shimRef = useRef(null)
  const mx      = useMotionValue(0)
  const my      = useMotionValue(0)
  const sx      = useSpring(mx, { stiffness: 200, damping: 18 })
  const sy      = useSpring(my, { stiffness: 200, damping: 18 })

  const handleMove = useCallback((e) => {
    if (!btnRef.current) return
    const r  = btnRef.current.getBoundingClientRect()
    const cx = r.left + r.width  / 2
    const cy = r.top  + r.height / 2
    mx.set((e.clientX - cx) * 0.30)
    my.set((e.clientY - cy) * 0.30)
  }, [mx, my])

  const handleLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  const handleEnter = () => {
    if (variant !== 'primary' || !shimRef.current) return
    shimRef.current.style.animation = 'none'
    void shimRef.current.offsetWidth
    shimRef.current.style.animation = 'shimmer 0.7s ease forwards'
  }

  const isPrimary = variant === 'primary'

  return (
    <motion.a
      ref={btnRef}
      href={href}

      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      whileHover={isPrimary
        ? { scale: 1.05, boxShadow: '0 0 48px rgba(255,59,31,0.65), 0 0 100px rgba(255,59,31,0.2)' }
        : { scale: 1.03, borderColor: 'rgba(255,255,255,0.22)' }
      }
      whileTap={{ scale: 0.96 }}
      className="relative inline-flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer select-none"
      style={{
         x: sx, y: sy,
        height:         '54px',
        padding:        '0 34px',
        borderRadius:   '16px',
        fontFamily:     'var(--font-display)',
        fontWeight:     600,
        fontSize:       '0.95rem',
        textDecoration: 'none',
        ...(isPrimary
          ? {
              background: 'linear-gradient(135deg, #ff4d33 0%, #ff3b1f 55%, #e11d2e 100%)',
              border:     '1px solid rgba(255,59,31,0.45)',
              color:      '#fff',
            }
          : {
              background:     'rgba(255,255,255,0.04)',
              border:         '1px solid rgba(255,255,255,0.1)',
              color:          'var(--text-1)',
              backdropFilter: 'blur(10px)',
            }),
      }}
    >
      {isPrimary && (
        <span
          ref={shimRef}
          aria-hidden
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.22) 50%,transparent 100%)',
            transform:  'translateX(-100%) skewX(-12deg)',
          }}
        />
      )}
      <span className="relative z-10">{label}</span>
      {Icon && (
        <motion.span className="relative z-10 flex items-center" whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
          <Icon size={18} strokeWidth={2.2} />
        </motion.span>
      )}
    </motion.a>
  )
}

/* ── Home CTA Section ────────────────────────────────────────── */
export function HomeCTA() {
  return (
    <section
      className="relative py-24 sm:py-36 overflow-hidden"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Orbit rings */}
      <OrbitRings />

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 75% 75% at 50% 50%, rgba(255,59,31,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 15% 80%, rgba(180,20,20,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.028]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      <div className="container-app relative">
        <MotionSection direction="up" className="text-center max-w-2xl mx-auto" reveal="spring">

          {/* Badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
              style={{
                background:   'rgba(255,59,31,0.09)',
                border:       '1px solid rgba(255,59,31,0.22)',
                color:        'var(--red)',
                fontFamily:   'var(--font-display)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Star size={10} fill="currentColor" />
              Start for Free
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-5 leading-none"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Ready to build your{' '}
            <span style={{ color: 'var(--red)', textShadow: '0 0 48px rgba(255,59,31,0.45)' }}>
              dream machine?
            </span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg leading-relaxed mx-auto mb-10"
            style={{ color: 'var(--text-2)', maxWidth: '460px' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            Configure your perfect PC, compare expert builds, and get live pricing — all without leaving the platform.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-9"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <CTAButton href="/build-lab"    label="Start Building"            variant="primary"   icon={ArrowRight} />
            <CTAButton href="/recommended"  label="View Recommended Builds"   variant="secondary" />
          </motion.div>

          {/* Trust line */}
          <motion.p
            className="text-xs"
            style={{ color: 'var(--text-3)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            No account required to browse. Create a free account to save builds.
          </motion.p>

        </MotionSection>
      </div>
    </section>
  )
}