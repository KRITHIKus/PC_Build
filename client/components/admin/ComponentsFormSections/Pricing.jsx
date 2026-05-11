'use client'

import { inputCls, inputStyle, focusStyle, blurStyle, FormField, SectionBlock } from './shared.js'

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP']

export default function Pricing({ form, setForm }) {
  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  const inStockNum = Number(form.inStock)
  const inStockOn  = form.inStock !== '' && inStockNum > 0

  return (
    <SectionBlock title="Pricing & Inventory">

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Estimated Price">
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
              style={{ color: 'var(--text-3)' }}
            >
              ₹
            </span>
            <input
              type="number"
              value={form.estimatedPrice}
              onChange={update('estimatedPrice')}
              placeholder="29999"
              min={0}
              className={`${inputCls} pl-7`}
              style={inputStyle}
              onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
              onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
            />
          </div>
        </FormField>

        <FormField label="Currency">
          <select
            value={form.currency}
            onChange={update('currency')}
            className={inputCls}
            style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
            onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
            onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Stock">
        <div className="flex items-center gap-3">
          {/* Toggle */}
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, inStock: inStockOn ? '0' : prev.inStock || '1' }))}
            className="relative w-10 h-6 rounded-full flex-shrink-0 transition-colors duration-200"
            style={{ background: inStockOn ? 'var(--red)' : 'rgba(255,255,255,0.12)' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200"
              style={{
                background:  '#fff',
                left:        inStockOn ? '18px' : '2px',
                boxShadow:   '0 1px 4px rgba(0,0,0,0.3)',
              }}
            />
          </button>
          <span className="text-xs" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
            {inStockOn ? 'In stock' : 'Out of stock'}
          </span>
          <input
            type="number"
            value={form.inStock}
            onChange={update('inStock')}
            placeholder="0"
            min={0}
            className="w-20 h-9 px-3 rounded-lg text-sm outline-none ml-auto transition-colors"
            style={inputStyle}
            onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
            onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
          />
        </div>
      </FormField>

    </SectionBlock>
  )
}