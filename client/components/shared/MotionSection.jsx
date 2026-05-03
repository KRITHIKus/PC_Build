'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * MotionSection — scroll-triggered reveal wrapper.
 * reveal: 'fade' | 'clip' | 'spring'
 * direction: 'up' | 'down' | 'left' | 'right' | 'none'
 */
export function MotionSection({
  children,
  delay     = 0,
  direction = 'up',
  duration  = 0.65,
  once      = true,
  amount    = 0.12,
  className = '',
  style,
  reveal    = 'fade',
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once, amount })

  const offsets = {
    up:    { y: 44,  x: 0   },
    down:  { y: -30, x: 0   },
    left:  { y: 0,   x: 44  },
    right: { y: 0,   x: -44 },
    none:  { y: 0,   x: 0   },
  }
  const { y, x } = offsets[direction] || offsets.up

  if (reveal === 'clip') {
    return (
      <div ref={ref} className={className} style={{ overflow: 'hidden', ...style }}>
        <motion.div
          initial={{ y: '110%', opacity: 0 }}
          animate={inView ? { y: '0%', opacity: 1 } : {}}
          transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>
    )
  }

  if (reveal === 'spring') {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={style}
        initial={{ opacity: 0, y, x, scale: 0.94 }}
        animate={inView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 80, damping: 18, delay }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}