'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ComponentFallbackVisual } from './ComponentFallbackVisual'
import { formatPrice } from '@/lib/utils'

/* ── Type badge ──────────────────────────────────────────────── */
function TypeBadge({ type }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
      style={{
        background: 'rgba(255,59,31,0.1)',
        border:     '1px solid rgba(255,59,31,0.22)',
        color:      'var(--red)',
        fontFamily: 'var(--font-display)',
      }}
    >
      {type}
    </span>
  )
}

/* ── Spec pills ──────────────────────────────────────────────── */
function SpecPills({ specs = {}, type }) {
  const priority = {
    CPU:         ['cores', 'threads', 'baseClock', 'socket'],
    GPU:         ['vram', 'coreClock', 'busWidth', 'tdp'],
    RAM:         ['capacity', 'speed', 'type', 'latency'],
    Motherboard: ['socket', 'chipset', 'formFactor', 'ramSlots'],
    Storage:     ['capacity', 'readSpeed', 'writeSpeed', 'interface'],
    PSU:         ['wattage', 'efficiency', 'modular'],
    Case:        ['formFactor', 'maxGpuLength', 'psuSupport'],
    Cooling:     ['type', 'tdp', 'fanSize', 'socket'],
  }

  const keys  = (priority[type] || Object.keys(specs)).slice(0, 4)
  const items = keys.filter(k => specs[k] !== undefined && specs[k] !== null && specs[k] !== '')

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {items.map(key => (
        <span
          key={key}
          className="text-[10px] px-2 py-0.5 rounded-md"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border:     '1px solid rgba(255,255,255,0.07)',
            color:      'var(--text-2)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {String(specs[key])}
        </span>
      ))}
    </div>
  )
}

/* ── Image with broken-image fallback ────────────────────────── */
function ComponentImage({ imageUrl, name, type }) {
  const [imgError, setImgError] = useState(false);

  const isPlaceholder = imageUrl?.includes("placehold.co");
  const shouldShowImage = imageUrl && !isPlaceholder && !imgError;

  if (!shouldShowImage) {
    return (
      <div className="w-28 h-28 flex items-center justify-center">
        <ComponentFallbackVisual type={type} size="lg" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-contain p-4"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
/* ── Component Card ──────────────────────────────────────────── */
export function ComponentCard({ component, index = 0 }) {
  if (!component) return null

  const {
    _id, name, brand, type, description,
    imageUrl, specs = {}, estimatedPrice,
  } = component

  const href = `/components/${_id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        delay:    (index % 6) * 0.06,
        duration: 0.45,
        ease:     [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={href} className="group block outline-none h-full">
        <motion.div
          className="relative h-full flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: 'var(--surface-2)',
            border:     '1px solid var(--border)',
          }}
          whileHover={{
            borderColor: 'rgba(255,59,31,0.38)',
            boxShadow:   '0 0 28px rgba(255,59,31,0.1), 0 12px 40px rgba(0,0,0,0.5)',
            y: -3,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Top hover glow line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.55), transparent)' }}
          />

          {/* Image / Fallback area */}
          <div
            className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              height:       '140px',
              background:   'rgba(0,0,0,0.25)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <ComponentImage imageUrl={imageUrl} name={name} type={type} />

            {/* Inner glow on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,59,31,0.07) 0%, transparent 70%)' }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4">
            {/* Type badge + brand */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <TypeBadge type={type} />
              {brand && (
                <span
                  className="text-[10px] truncate"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                >
                  {brand}
                </span>
              )}
            </div>

            {/* Name */}
            <h3
              className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
            >
              {name}
            </h3>

            {/* Description */}
            {description && (
              <p
                className="text-xs leading-relaxed line-clamp-2 mb-2"
                style={{ color: 'var(--text-3)' }}
              >
                {description}
              </p>
            )}

            {/* Spec pills */}
            <SpecPills specs={specs} type={type} />

            {/* Footer: price + arrow */}
            <div
              className="flex items-center justify-between mt-auto pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '12px' }}
            >
              <div>
                {estimatedPrice != null ? (
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
                  >
                    {formatPrice(estimatedPrice)}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: 'var(--text-3)' }}>Price TBD</span>
                )}
              </div>

              <motion.div
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.14 }}
              >
                Details
                <ArrowRight size={12} strokeWidth={2.3} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}