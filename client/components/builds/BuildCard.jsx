'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Cpu, Monitor, MemoryStick, CheckCircle2,
  ArrowRight, GitCompare, ChevronDown, ChevronUp,
  Zap,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

/* ── Compatibility badge ─────────────────────────────────────── */
function CompatBadge({ compatible }) {
  const ok = compatible !== false
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(255,59,31,0.1)',
        border:     ok ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,59,31,0.25)',
        color:      ok ? '#22c55e' : 'var(--red)',
        fontFamily: 'var(--font-display)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: ok ? '#22c55e' : 'var(--red)' }}
      />
      {ok ? 'Compatible' : 'Check Required'}
    </span>
  )
}

/* ── Part row ────────────────────────────────────────────────── */
function PartRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.15)' }}
      >
        <Icon size={13} style={{ color: 'var(--red)' }} strokeWidth={2} />
      </span>
      <span className="text-xs flex-shrink-0 w-8" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
        {label}
      </span>
      <span className="text-xs font-medium truncate flex-1" style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
        {value}
      </span>
    </div>
  )
}

/* ── CTA Button ──────────────────────────────────────────────── */
function CardButton({ label, variant = 'primary', icon: Icon, onClick, disabled, href }) {
  const shimRef = useRef(null)

  const handleEnter = () => {
    if (variant !== 'primary' || !shimRef.current || disabled) return
    shimRef.current.style.animation = 'none'
    void shimRef.current.offsetWidth
    shimRef.current.style.animation = 'shimmer 0.65s ease forwards'
  }

  const isPrimary = variant === 'primary'

  const sharedProps = {
    onClick,
    onMouseEnter: handleEnter,
    className:
      'relative w-full sm:flex-1 flex items-center justify-center gap-2 overflow-hidden text-base sm:text-sm font-semibold transition-all duration-150',
    style: {
      height: '48px',
      borderRadius: '12px',
      fontFamily: 'var(--font-display)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      textDecoration: 'none',
      border: 'none',
      ...(isPrimary
        ? {
            background: disabled
              ? 'rgba(255,59,31,0.3)'
              : 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)',
            color: '#fff',
          }
        : {
            background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: disabled ? 'var(--text-3)' : 'var(--text-2)',
          }),
    },
  }

  const content = (
    <>
      {isPrimary && (
        <span
          ref={shimRef}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
            transform: 'translateX(-100%) skewX(-12deg)',
          }}
        />
      )}

      {Icon && (
        <Icon
          size={14}
          strokeWidth={2.2}
          className="relative z-10 flex-shrink-0"
        />
      )}

      <span className="relative z-10">{label}</span>
    </>
  )

  if (href && !disabled) {
    return (
      <motion.div
        whileHover={isPrimary
          ? { scale: 1.02, boxShadow: '0 0 20px rgba(255,59,31,0.45)' }
          : { scale: 1.02 }
        }
        whileTap={{ scale: 0.97 }}
        className="w-full sm:flex-1"
      >
        <Link href={href} {...sharedProps}>
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? {} : isPrimary
        ? { scale: 1.02, boxShadow: '0 0 20px rgba(255,59,31,0.45)' }
        : { scale: 1.02, borderColor: 'rgba(255,255,255,0.25)' }
      }
      whileTap={disabled ? {} : { scale: 0.97 }}
      {...sharedProps}
    >
      {content}
    </motion.button>
  )
}

/* ── Use case tag ────────────────────────────────────────────── */
function UseTag({ label }) {
  return (
    <span
      className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border:     '1px solid rgba(255,255,255,0.08)',
        color:      'var(--text-3)',
        fontFamily: 'var(--font-display)',
      }}
    >
      {label}
    </span>
  )
}

/* ── Build Card ──────────────────────────────────────────────── */
export function BuildCard({ build, index = 0, isSelected, onCompareToggle }) {
  const [expanded, setExpanded] = useState(false)
  if (!build) return null

  const {
    _id,
    title,
    description,
    source,
    parts = {},
    totalEstimatedPrice,
    currency = 'INR',
    compatibilityResult,
    isFeatured,
    isDreamBuild,
  } = build

  const cpu = parts?.cpu?.name ?? null
  const gpu = parts?.gpu?.name ?? null
  const ram = parts?.ram?.name ?? null
  const storage = Array.isArray(parts?.storage)
    ? parts.storage?.[0]?.name
    : parts?.storage?.name ?? null

  const price = totalEstimatedPrice ?? null
  const compatible = compatibilityResult?.valid ?? true

  const cardLabel = isDreamBuild
    ? 'Dream'
    : isFeatured
      ? 'Featured'
      : source === 'recommendation'
        ? 'Recommended'
        : 'Build'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ delay: (index % 6) * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative flex flex-col rounded-2xl overflow-hidden h-full"
        style={{
          background: 'var(--surface-1)',
          border: isSelected
            ? '1px solid rgba(255,59,31,0.5)'
            : '1px solid var(--border)',
          boxShadow: isSelected
            ? '0 0 0 1px rgba(255,59,31,0.2), 0 0 30px rgba(255,59,31,0.12)'
            : 'none',
        }}
        whileHover={{
          y: -6,
          boxShadow: isSelected
            ? '0 0 0 1px rgba(255,59,31,0.35), 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,59,31,0.15)'
            : '0 20px 60px rgba(0,0,0,0.55), 0 0 28px rgba(255,59,31,0.1)',
          borderColor: isSelected ? 'rgba(255,59,31,0.55)' : 'rgba(255,59,31,0.3)',
        }}
        transition={{ duration: 0.22 }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,59,31,0.5),transparent)' }}
        />

        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ background: 'rgba(255,59,31,0.04)' }}
          />
        )}

        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap gap-y-2">
            <CompatBadge compatible={compatible} />
            <UseTag label={cardLabel} />
          </div>

          <h3
            className="text-lg font-bold leading-snug mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--text-1)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>

          {description && (
            <p
              className="text-sm leading-relaxed mb-4 line-clamp-2"
              style={{ color: 'var(--text-2)' }}
            >
              {description}
            </p>
          )}

          <div className="flex flex-col mb-4">
            <PartRow icon={Cpu} label="CPU" value={cpu} />
            <PartRow icon={Monitor} label="GPU" value={gpu} />
            <PartRow icon={MemoryStick} label="RAM" value={ram} />

            {expanded && (
              <PartRow icon={Zap} label="SSD" value={storage} />
            )}
          </div>

          {storage && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs self-start mb-4 transition-colors"
              style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? 'Less details' : 'More details'}
            </button>
          )}

          <div className="flex-1" />

          <div
            className="flex items-center justify-between mb-4 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div>
              <p
                className="text-xs mb-0.5"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
              >
                Total Price
              </p>

              {price != null ? (
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-1)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatPrice(price, currency)}
                </p>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                  Price TBD
                </p>
              )}
            </div>

            {compatible !== false && (
              <CheckCircle2 size={22} style={{ color: '#22c55e', opacity: 0.7 }} />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <CardButton
              label="View Build"
              variant="primary"
              icon={ArrowRight}
              href={`/recommended/${_id}`}
            />

            <CardButton
              label={isSelected ? 'Remove' : 'Compare'}
              variant="secondary"
              icon={GitCompare}
              onClick={() => onCompareToggle?.(_id)}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}