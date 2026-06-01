'use client'

import { motion } from 'framer-motion'
import { Plus, BookOpen } from 'lucide-react'

export function LearnHeader({ onCreateClick }) {
  return (
    <motion.header
      initial={{ opacity:0, y:-10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.38, ease:[0.25,0.46,0.45,0.94] }}
      style={{
        position:'relative', overflow:'hidden',
        background:'linear-gradient(180deg, var(--surface-2) 0%, var(--bg) 100%)',
        borderBottom:'1px solid var(--border)',
      }}
    >
      {/* Subtle grid */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`linear-gradient(var(--border) 1px,transparent 1px),
                         linear-gradient(90deg,var(--border) 1px,transparent 1px)`,
        backgroundSize:'40px 40px', opacity:0.25,
      }} />

      {/* Bottom glow */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ duration:0.9, delay:0.25, ease:[0.16,1,0.3,1] }}
        style={{
          position:'absolute', bottom:0, left:0, right:0, height:1,
          transformOrigin:'left',
          background:'linear-gradient(90deg,transparent 0%,var(--red) 40%,var(--red) 60%,transparent 100%)',
          boxShadow:'0 0 14px var(--red-glow)',
        }}
      />

      <div style={{
        position:'relative', maxWidth:'80rem', margin:'0 auto',
        padding:'clamp(1.5rem,4vw,2.25rem) clamp(1rem,4vw,1.5rem)',
        display:'flex', alignItems:'flex-end',
        justifyContent:'space-between', flexWrap:'wrap', gap:'1rem',
      }}>

        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <div style={{
              width:28, height:28, borderRadius:7,
              background:'rgba(255,59,31,0.1)', border:'1px solid var(--red-border)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <BookOpen size={13} style={{ color:'var(--red)' }} />
            </div>
            <span style={{
              fontFamily:'var(--font-display)', fontSize:10,
              color:'var(--text-3)', letterSpacing:'0.18em', textTransform:'uppercase',
            }}>
              ADMIN · CONTENT MANAGEMENT
            </span>
          </div>

          <h1
            className="text-red-gradient"
            style={{
              fontFamily:'var(--font-display)',
              fontSize:'clamp(1.6rem,4vw,2.5rem)',
              fontWeight:800, letterSpacing:'-0.04em', margin:0, lineHeight:1.05,
            }}
          >
            Learning Hub
          </h1>
          <p style={{
            fontFamily:'var(--font-body)', fontSize:13,
            color:'var(--text-2)', marginTop:6, marginBottom:0,
          }}>
            Manage articles, guides, and tutorials for your community
          </p>
        </div>

        {/* CTA */}
        <motion.button
          onClick={onCreateClick}
          whileHover={{ y:-2, boxShadow:'0 0 28px var(--red-glow)' }}
          whileTap={{ scale:0.97 }}
          transition={{ duration:0.18 }}
          style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'10px 20px', borderRadius:10,
            background:'var(--red)', color:'#fff',
            fontFamily:'var(--font-display)', fontSize:13, fontWeight:700,
            border:'none', cursor:'pointer', letterSpacing:'0.03em',
            boxShadow:'0 0 18px var(--red-glow)',
            flexShrink:0,
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Article
        </motion.button>
      </div>
    </motion.header>
  )
}