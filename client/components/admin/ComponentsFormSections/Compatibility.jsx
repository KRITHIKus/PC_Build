'use client'

import { Plus, Trash2 } from 'lucide-react'
import { inputStyle, SectionBlock } from './shared.js'

function KeyValueRows({ rows, onChange }) {
  const addRow    = ()          => onChange([...rows, { key: '', value: '' }])
  const removeRow = (i)         => onChange(rows.filter((_, idx) => idx !== i))
  const updateRow = (i, f, val) =>
    onChange(rows.map((r, idx) => idx === i ? { ...r, [f]: val } : r))

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={row.key}
            onChange={e => updateRow(i, 'key', e.target.value)}
            placeholder="Component / socket"
            className="flex-1 h-9 px-3 rounded-lg text-xs outline-none transition-colors"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,59,31,0.4)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <input
            type="text"
            value={row.value}
            onChange={e => updateRow(i, 'value', e.target.value)}
            placeholder="Value / standard"
            className="flex-1 h-9 px-3 rounded-lg text-xs outline-none transition-colors"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,59,31,0.4)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
            style={{ color: 'var(--text-3)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-medium transition-colors self-start"
        style={{
          color:      'var(--text-2)',
          background: 'var(--surface-2)',
          border:     '1px solid var(--border)',
          fontFamily: 'var(--font-display)',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'rgba(255,59,31,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <Plus size={12} strokeWidth={2.5} />
        Add Field
      </button>
    </div>
  )
}

export default function Compatibility({ form, setForm }) {
  return (
    <SectionBlock title="Compatibility">
      <KeyValueRows
        rows={form.compatibility}
        onChange={rows => setForm(prev => ({ ...prev, compatibility: rows }))}
      />
    </SectionBlock>
  )
}