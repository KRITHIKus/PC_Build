'use client'

import { useState, useEffect } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { useCreatePricingMutation } from '@/services/pricingApi'

const fieldStyle = {
  background: 'var(--surface-2)',
  color: 'var(--text-1)',
  border: '1px solid var(--border)',
  fontFamily: 'var(--font-display)',
  transition: 'border-color 0.15s',
}

const REGIONS = ['Karnataka', 'Tamil Nadu', 'Delhi', 'Maharashtra']

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-3)' }}
      >
        {label}
        {required && <span style={{ color: 'var(--red)', lineHeight: 1 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export default function PricingForm({ componentId, onSuccess, region }) {
  const [price, setPrice] = useState('')
  const [selectedRegion, setSelectedRegion] = useState(region || '')
  const [sourceName, setSourceName] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const [createPricing, { isLoading }] = useCreatePricingMutation()

  useEffect(() => {
    if (region) setSelectedRegion(region)
  }, [region])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!componentId) return setError('Select a component first.')
    if (!selectedRegion) return setError('Please select a region.')

    try {
      await createPricing({
        component: componentId,
        price: Number(price),
        sourceName,
        region: selectedRegion,
        notes,
      }).unwrap()

      setPrice('')
      setSourceName('')
      setNotes('')
      onSuccess?.()
    } catch (err) {
      setError(err?.data?.message || 'Failed to add price.')
    }
  }

  const canSubmit = !!componentId && !!price && Number(price) > 0 && !!selectedRegion && !!sourceName && !isLoading

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      <p
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        Add Price Entry
      </p>

      {error && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
          style={{
            background: 'rgba(220,38,38,0.06)',
            color: '#dc2626',
            border: '1px solid rgba(220,38,38,0.18)',
          }}
        >
          <AlertCircle size={13} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <Field label="Price (₹)" required>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 29999"
            required
            min={1}
            className="w-full h-10 px-3 rounded-xl text-sm outline-none"
            style={fieldStyle}
          />
        </Field>

        <Field label="Region" required>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            required
            className="w-full h-10 px-3 rounded-xl text-sm outline-none"
            style={fieldStyle}
          >
            <option value="">Select region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>

        <Field label="Source" required>
          <input
            type="text"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="e.g. Amazon, Flipkart, Local Store"
            required
            className="w-full h-10 px-3 rounded-xl text-sm outline-none"
            style={fieldStyle}
          />
        </Field>

        <Field label="Notes">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra info…"
            className="w-full h-10 px-3 rounded-xl text-sm outline-none"
            style={fieldStyle}
          />
        </Field>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white"
          style={{
            background: canSubmit ? 'var(--red)' : 'rgba(255,59,31,0.25)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
        >
          <Plus size={14} />
          {isLoading ? 'Saving…' : 'Add Price'}
        </button>

      </form>
    </div>
  )
}