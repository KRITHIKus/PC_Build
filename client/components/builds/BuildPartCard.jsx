'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ComponentFallbackVisual } from '@/components/components/ComponentFallbackVisual'
import { formatPrice } from '@/lib/utils'

/* ── Format spec key → readable label ────────────────────────── */
function fmtKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim()
}

/* ── Format spec value ───────────────────────────────────────── */
function fmtVal(val) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (Array.isArray(val)) return val.join(', ')
  return String(val)
}

/* ── Image with placeholder + error fallback ─────────────────── */
function PartImage({ imageUrl, name, type }) {
  const [errored, setErrored] = useState(false)

  const isPlaceholder =
    !imageUrl ||
    imageUrl.includes('placehold.co') ||
    imageUrl.includes('placeholder') ||
    errored

  if (isPlaceholder) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div style={{ width: '90px', height: '90px' }}>
          <ComponentFallbackVisual type={type} size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageUrl}
        alt={name ?? type}
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setErrored(true)}
      />
    </div>
  )
}

/* ── Spec row ────────────────────────────────────────────────── */
function SpecRow({ label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="flex items-start gap-3 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span
        className="text-xs flex-shrink-0"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)', minWidth: '110px' }}
      >
        {label}
      </span>
      <span
        className="text-xs font-medium break-words flex-1 text-right"
        style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
      >
        {value}
      </span>
    </motion.div>
  )
}

/* ── Build Part Card ─────────────────────────────────────────── */
export function BuildPartCard({ partKey, partEntry, index = 0 }) {
  if (!partEntry) return null

  // partEntry shape: { component: {...}, quantity, notes }
  // or partEntry may BE the component directly — handle both
  const component = partEntry?.component ?? partEntry
  if (!component) return null

  const {
    name, brand, model, type, imageUrl,
    estimatedPrice, specs = {},
  } = component

  // Gather all non-empty spec entries
  const specEntries = Object.entries(specs ?? {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  )

  // Display type — prefer component.type, else use the partKey
  const displayType = type ?? partKey?.toUpperCase() ?? 'Component'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.07 }}
      transition={{ delay: index * 0.07, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="rounded-2xl overflow-hidden h-full"
        style={{
          background: 'var(--surface-1)',
          border:     '1px solid var(--border)',
        }}
        whileHover={{
          borderColor: 'rgba(255,59,31,0.35)',
          boxShadow:   '0 0 24px rgba(255,59,31,0.09), 0 12px 40px rgba(0,0,0,0.5)',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Top accent */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,59,31,0.45),transparent)' }} />

        {/* Image area */}
        <div
          className="relative"
          style={{
            height:       '160px',
            background:   'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <PartImage imageUrl={imageUrl} name={name} type={displayType} />
        </div>

        {/* Info */}
        <div className="p-5">
          {/* Type badge */}
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{
              background: 'rgba(255,59,31,0.1)',
              border:     '1px solid rgba(255,59,31,0.22)',
              color:      'var(--red)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {displayType}
          </span>

          {/* Name */}
          <h4
            className="text-base font-bold leading-snug mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
          >
            {name ?? 'Unknown'}
          </h4>

          {/* Brand / model */}
          {(brand || model) && (
            <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
              {[brand, model].filter(Boolean).join(' · ')}
            </p>
          )}

          {/* Price */}
          {estimatedPrice != null && (
            <div
              className="flex items-center justify-between mb-4 pb-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                Est. Price
              </span>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
              >
                {formatPrice(estimatedPrice)}
              </span>
            </div>
          )}

          {/* Notes */}
          {partEntry?.notes && (
            <p className="text-xs mb-4 italic" style={{ color: 'var(--text-3)' }}>
              {partEntry.notes}
            </p>
          )}

          {/* Quantity */}
          {partEntry?.quantity != null && partEntry.quantity !== 1 && (
            <p className="text-xs mb-3" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
              Qty: <span style={{ color: 'var(--text-2)' }}>{partEntry.quantity}</span>
            </p>
          )}

          {/* All specs */}
          {specEntries.length > 0 ? (
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
              >
                Specifications
              </p>
              <div>
                {specEntries.map(([key, val], i) => (
                  <SpecRow
                    key={key}
                    label={fmtKey(key)}
                    value={fmtVal(val)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>No specifications available.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Storage Part Card — handles array ───────────────────────── */
export function StoragePartCard({ storageArray = [], startIndex = 0 }) {
  if (!storageArray.length) return null

  return (
    <>
      {storageArray.map((entry, i) => (
        <BuildPartCard
          key={i}
          partKey="Storage"
          partEntry={entry}
          index={startIndex + i}
        />
      ))}
    </>
  )
}