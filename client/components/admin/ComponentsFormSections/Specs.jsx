'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { SectionBlock } from './shared.js'

export default function Tags({ form, setForm }) {
  const [input, setInput] = useState('')

  const addTag = (raw) => {
    const tag = raw.trim().replace(/,$/, '').trim()
    if (!tag || form.tags.includes(tag)) { setInput(''); return }
    setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    setInput('')
  }

  const removeTag = (tag) =>
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(input) }
    if (e.key === ',')     { e.preventDefault(); addTag(input) }
    if (e.key === 'Backspace' && !input && form.tags.length > 0) {
      setForm(prev => ({ ...prev, tags: prev.tags.slice(0, -1) }))
    }
  }

  return (
    <SectionBlock title="Tags">
      <div
        className="flex flex-wrap items-center gap-1.5 min-h-[42px] px-3 py-2 rounded-xl transition-colors"
        style={{
          background: 'var(--surface-2)',
          border:     '1px solid var(--border)',
        }}
      >
        {form.tags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium"
            style={{
              background: 'rgba(255,59,31,0.1)',
              color:      'var(--red)',
              border:     '1px solid rgba(255,59,31,0.2)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="flex items-center"
              style={{ color: 'var(--red)', opacity: 0.7 }}
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={form.tags.length ? '' : 'Type a tag and press Enter…'}
          className="flex-1 min-w-[120px] text-xs bg-transparent outline-none"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
        />
      </div>
      <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
        Press Enter or comma to add a tag.
      </p>
    </SectionBlock>
  )
}