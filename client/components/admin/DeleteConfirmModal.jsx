'use client'

import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmModal({ title, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={!loading ? onCancel : undefined}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}
        >
          <AlertTriangle size={20} strokeWidth={2} />
        </div>

        <h2
          className="text-base font-semibold mb-1.5"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
        >
          Delete {title ? `"${title}"` : 'this item'}?
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-3)', lineHeight: '1.5' }}>
          This action cannot be undone. The item will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: 'var(--surface-2)',
              color:      'var(--text-1)',
              border:     '1px solid var(--border)',
              cursor:     loading ? 'not-allowed' : 'pointer',
              opacity:    loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: '#dc2626',
              cursor:     loading ? 'not-allowed' : 'pointer',
              opacity:    loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}