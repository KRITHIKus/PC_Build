// Shared constants used by all ComponentFormSection files

export const inputCls =
  'w-full h-10 px-3 rounded-xl text-sm outline-none transition-colors duration-150'

export const inputStyle = {
  background: 'var(--surface-2)',
  color:      'var(--text-1)',
  border:     '1px solid var(--border)',
  fontFamily: 'var(--font-display)',
}

export const focusStyle = { borderColor: 'rgba(255,59,31,0.45)' }
export const blurStyle  = { borderColor: 'var(--border)' }

export function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function SectionBlock({ title, children }) {
  return (
    <div className="flex flex-col gap-3 pb-6 mb-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <p
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}