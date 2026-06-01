'use client'

import { motion } from 'framer-motion'
import { FileText, Plus } from 'lucide-react'

export function EmptyState({ onCreateClick }) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.38, ease:[0.25,0.46,0.45,0.94] }}
      style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', textAlign:'center',
        padding:'5rem 1.5rem', gap:'1.25rem',
      }}
    >
      {/* Icon ring */}
      <div style={{ position:'relative' }}>
        <div style={{
          width:72, height:72, borderRadius:20,
          background:'var(--surface-2)', border:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <FileText size={28} style={{ color:'var(--text-3)' }} />
        </div>
        {/* Subtle glow ring */}
        <div style={{
          position:'absolute', inset:-4, borderRadius:24,
          border:'1px solid var(--red-border)', opacity:0.3,
          pointerEvents:'none',
        }} />
      </div>

      <div style={{ maxWidth:320 }}>
        <h2 style={{
          fontFamily:'var(--font-display)', fontSize:18, fontWeight:700,
          color:'var(--text-1)', margin:'0 0 6px', letterSpacing:'-0.02em',
        }}>
          No articles yet
        </h2>
        <p style={{
          fontFamily:'var(--font-body)', fontSize:13,
          color:'var(--text-2)', margin:0, lineHeight:1.65,
        }}>
          Start building your learning hub by creating your first guide, tutorial, or reference article.
        </p>
      </div>

      <motion.button
        onClick={onCreateClick}
        whileHover={{ y:-2, boxShadow:'0 0 24px var(--red-glow)' }}
        whileTap={{ scale:0.97 }}
        transition={{ duration:0.18 }}
        style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'10px 22px', borderRadius:10,
          background:'var(--red)', color:'#fff',
          fontFamily:'var(--font-display)', fontSize:13, fontWeight:700,
          border:'none', cursor:'pointer', letterSpacing:'0.03em',
          boxShadow:'0 0 18px var(--red-glow)',
          marginTop:4,
        }}
      >
        <Plus size={15} strokeWidth={2.5} />
        Create your first article
      </motion.button>
    </motion.div>
  )
}