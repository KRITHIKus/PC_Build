'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export function DeleteConfirmModal({ article, isDeleting, onConfirm, onCancel }) {
  /* Escape to cancel */
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCancel?.() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onCancel])

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <AnimatePresence>
      <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.22 }}
          onClick={onCancel}
          style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)' }}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity:0, scale:0.94, y:12 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:0.94, y:8 }}
          transition={{ duration:0.28, ease:[0.16,1,0.3,1] }}
          style={{
            position:'relative', zIndex:1,
            width:'100%', maxWidth:420,
            background:'var(--surface-2)', borderRadius:16,
            border:'1px solid var(--border)',
            overflow:'hidden',
          }}
        >
          {/* Top accent */}
          <div style={{ height:1, background:'linear-gradient(90deg,transparent,var(--red),transparent)' }} />

          <div style={{ padding:'1.5rem' }}>
            {/* Icon */}
            <div style={{
              width:44, height:44, borderRadius:12, marginBottom:'1rem',
              background:'rgba(255,59,31,0.10)', border:'1px solid var(--red-border)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <AlertTriangle size={20} style={{ color:'var(--red)' }} />
            </div>

            <h3 style={{
              fontFamily:'var(--font-display)', fontSize:17, fontWeight:700,
              color:'var(--text-1)', margin:'0 0 6px', letterSpacing:'-0.02em',
            }}>
              Delete Article
            </h3>

            <p style={{
              fontFamily:'var(--font-body)', fontSize:13, color:'var(--text-2)',
              margin:'0 0 1.5rem', lineHeight:1.6,
            }}>
              You're about to permanently delete{' '}
              <strong style={{ color:'var(--text-1)', fontFamily:'var(--font-display)' }}>
                "{article?.title}"
              </strong>
              . This cannot be undone.
            </p>

            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={onCancel}
                disabled={isDeleting}
                style={{
                  flex:1, padding:'10px', borderRadius:9,
                  background:'var(--surface-3)', border:'1px solid var(--border)',
                  color:'var(--text-2)', fontFamily:'var(--font-display)',
                  fontSize:13, fontWeight:600, cursor:'pointer', letterSpacing:'0.02em',
                  transition:'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-strong)'; e.currentTarget.style.color='var(--text-1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-2)' }}
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={isDeleting}
                style={{
                  flex:1, padding:'10px', borderRadius:9,
                  background: isDeleting ? 'rgba(255,59,31,0.5)' : 'var(--red)',
                  border:'none', color:'#fff',
                  fontFamily:'var(--font-display)', fontSize:13, fontWeight:700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  letterSpacing:'0.02em', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:7,
                  boxShadow: isDeleting ? 'none' : '0 0 14px var(--red-glow)',
                  transition:'all 0.18s',
                }}
              >
                {isDeleting
                  ? <><Loader2 size={13} style={{ animation:'spin 0.75s linear infinite' }} /> Deleting…</>
                  : <><Trash2 size={13} /> Delete</>
                }
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}