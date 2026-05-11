'use client'

import { Upload } from 'lucide-react'
import { inputCls, inputStyle, focusStyle, blurStyle, FormField, SectionBlock } from './shared.js'

export default function Details({ form, setForm, imageFile, onFileChange }) {
  const preview = imageFile ? URL.createObjectURL(imageFile) : form.image || null

  return (
    <SectionBlock title="Media & Description">

      {/* Image upload */}
      <FormField label="Image">
        <label
          className="flex items-center gap-3 h-10 px-3 rounded-xl cursor-pointer transition-colors"
          style={inputStyle}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,59,31,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <Upload size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <span className="text-sm truncate" style={{ color: imageFile ? 'var(--text-1)' : 'var(--text-3)' }}>
            {imageFile ? imageFile.name : 'Upload image…'}
          </span>
          <input type="file" accept="image/*" onChange={onFileChange} className="sr-only" />
        </label>

        {preview && (
          <div
            className="mt-2 flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          >
            <img
              src={preview}
              alt="Preview"
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              style={{ border: '1px solid var(--border)' }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-1)' }}>
                {imageFile ? imageFile.name : 'Current image'}
              </p>
              {imageFile && (
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {(imageFile.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>
          </div>
        )}
      </FormField>

      {/* Description */}
      <FormField label="Description">
        <textarea
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this component…"
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-colors"
          style={{ ...inputStyle, lineHeight: '1.5' }}
          onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
          onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
        />
      </FormField>

    </SectionBlock>
  )
}