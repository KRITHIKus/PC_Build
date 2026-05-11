'use client'

import { Package } from 'lucide-react'

const TYPES = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Cabinet', 'Cooling']

function PreviewBadge({ children, color = 'var(--red)', bg = 'rgba(255,59,31,0.1)' }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={{ background: bg, color, fontFamily: 'var(--font-display)', border: `1px solid ${bg.replace('0.1', '0.2')}` }}
    >
      {children}
    </span>
  )
}

export default function ComponentPreviewPanel({ form, imageFile }) {
  const preview = imageFile ? URL.createObjectURL(imageFile) : form.image || null
  const hasSpecs  = form.specs?.some(r => r.key)
  const hasCompat = form.compatibility?.some(r => r.key)
  const isEmpty   = !form.name && !form.brand && !form.type

  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        Live Preview
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        {/* Image */}
        <div
          className="w-full h-40 flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Package size={36} strokeWidth={1} style={{ color: 'rgba(255,255,255,0.1)' }} />
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3">
          {isEmpty ? (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-3)' }}>
              Fill in the form to see a preview.
            </p>
          ) : (
            <>
              {/* Type + stock */}
              <div className="flex items-center gap-2 flex-wrap">
                {form.type && <PreviewBadge>{form.type}</PreviewBadge>}
                {form.inStock !== '' && form.inStock !== undefined && (
                  <PreviewBadge
                    color={Number(form.inStock) > 0 ? '#22c55e' : '#dc2626'}
                    bg={Number(form.inStock) > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.1)'}
                  >
                    {Number(form.inStock) > 0 ? `${form.inStock} in stock` : 'Out of stock'}
                  </PreviewBadge>
                )}
              </div>

              {/* Name */}
              {form.name && (
                <div>
                  <p
                    className="text-base font-bold leading-tight"
                    style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
                  >
                    {form.name}
                  </p>
                  {(form.brand || form.model) && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                      {[form.brand, form.model].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              )}

              {/* Price */}
              {form.estimatedPrice && (
                <p
                  className="text-xl font-bold"
                  style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
                >
                  ₹{Number(form.estimatedPrice).toLocaleString('en-IN')}
                </p>
              )}

              {/* Description */}
              {form.description && (
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-3)' }}>
                  {form.description}
                </p>
              )}

              {/* Tags */}
              {form.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--surface-1)', color: 'var(--text-3)', border: '1px solid var(--border)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Specs */}
              {hasSpecs && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)' }}>
                    Specs
                  </p>
                  <div className="flex flex-col gap-1">
                    {form.specs.filter(r => r.key).map((row, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-3)' }}>{row.key}</span>
                        <span style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility */}
              {hasCompat && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)' }}>
                    Compatibility
                  </p>
                  <div className="flex flex-col gap-1">
                    {form.compatibility.filter(r => r.key).map((row, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-3)' }}>{row.key}</span>
                        <span style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}