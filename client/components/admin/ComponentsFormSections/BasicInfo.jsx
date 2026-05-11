'use client'

import { inputCls, inputStyle, focusStyle, blurStyle, FormField, SectionBlock } from './shared.js'

const TYPES = [
  'CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Cabinet', 'Cooling', 'Other',
]

export default function BasicInfo({ form, setForm }) {
  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <SectionBlock title="Basic Info">

      <FormField label="Name">
        <input
          type="text"
          value={form.name}
          onChange={update('name')}
          placeholder="e.g. Intel Core i9-14900K"
          required
          className={inputCls}
          style={inputStyle}
          onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
          onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Brand">
          <input
            type="text"
            value={form.brand}
            onChange={update('brand')}
            placeholder="e.g. Intel"
            className={inputCls}
            style={inputStyle}
            onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
            onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
          />
        </FormField>

        <FormField label="Model">
          <input
            type="text"
            value={form.model}
            onChange={update('model')}
            placeholder="e.g. BX8071514900K"
            className={inputCls}
            style={inputStyle}
            onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
            onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
          />
        </FormField>
      </div>

      <FormField label="Type">
        <select
          value={form.type}
          onChange={update('type')}
          required
          className={inputCls}
          style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
          onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
          onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
        >
          <option value="">Select type…</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </FormField>

    </SectionBlock>
  )
}