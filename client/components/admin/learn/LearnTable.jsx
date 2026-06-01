'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Eye, EyeOff,BookAIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';

import Image from 'next/image'

/* ── Difficulty badge ────────────────────────────────────────── */
const DIFF = {
  beginner:     { label:'Beginner',     bg:'rgba(255,59,31,0.06)',  color:'var(--text-2)',  border:'var(--border)' },
  intermediate: { label:'Intermediate', bg:'rgba(255,59,31,0.10)',  color:'var(--red)',     border:'var(--red-border)' },
  advanced:     { label:'Advanced',     bg:'rgba(255,59,31,0.16)',  color:'var(--red)',     border:'var(--red-border)' },
}

function DiffBadge({ value }) {
  const d = DIFF[value?.toLowerCase()] ?? DIFF.beginner
  return (
    <span style={{
      padding:'2px 8px', borderRadius:5, fontSize:10, fontWeight:600,
      fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase',
      background:d.bg, color:d.color, border:`1px solid ${d.border}`,
    }}>
      {d.label}
    </span>
  )
}

/* ── Status badge ────────────────────────────────────────────── */
function StatusBadge({ isPublished }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'2px 8px', borderRadius:5, fontSize:10, fontWeight:600,
      fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase',
      background: isPublished ? 'rgba(255,59,31,0.08)' : 'rgba(255,255,255,0.04)',
      color:      isPublished ? 'var(--red)'            : 'var(--text-3)',
      border:     isPublished ? '1px solid var(--red-border)' : '1px solid var(--border)',
    }}>
      {isPublished
        ? <Eye size={9} style={{ color:'var(--red)' }} />
        : <EyeOff size={9} />
      }
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}

/* ── Cover thumbnail ─────────────────────────────────────────── */
function CoverThumb({ src, title }) {
  if (!src) {
    return (
      <div style={{
        width:48, height:36, borderRadius:6, flexShrink:0,
        background:'var(--surface-3)', border:'1px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ fontSize:16 }}>📄</span>
      </div>
    )
  }
  return (
    <div style={{ width:48, height:36, borderRadius:6, overflow:'hidden', flexShrink:0, border:'1px solid var(--border)' }}>
      <img src={src} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
    </div>
  )
}

/* ── Row action button ───────────────────────────────────────── */
function ActionBtn({ icon: Icon, onClick, danger = false, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        width:30, height:30, borderRadius:7, cursor:'pointer',
        background: danger ? 'rgba(255,59,31,0.08)' : 'var(--surface-3)',
        border:     danger ? '1px solid var(--red-border)' : '1px solid var(--border)',
        color:      danger ? 'var(--red)' : 'var(--text-2)',
        transition:'all 0.18s ease', flexShrink:0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'rgba(255,59,31,0.15)' : 'var(--surface-2)'
        e.currentTarget.style.borderColor = danger ? 'var(--red)' : 'var(--border-strong)'
        e.currentTarget.style.color = danger ? 'var(--red)' : 'var(--text-1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = danger ? 'rgba(255,59,31,0.08)' : 'var(--surface-3)'
        e.currentTarget.style.borderColor = danger ? 'var(--red-border)' : 'var(--border)'
        e.currentTarget.style.color = danger ? 'var(--red)' : 'var(--text-2)'
      }}
    >
      <Icon size={13} />
    </button>
  )
}

/* ── Desktop table row ───────────────────────────────────────── */
function TableRow({ article, onEdit, onDelete, index }) {
  const router = useRouter();
  return (
    <motion.tr
      initial={{ opacity:0, y:6 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.04, duration:0.3, ease:'easeOut' }}
      style={{ borderBottom:'1px solid var(--border)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        
    >
      {/* Cover */}
      <td style={{ padding:'12px 16px' }}>
        <CoverThumb src={article.coverImageUrl} title={article.title} />
      </td>

      {/* Title */}
      <td style={{ padding:'12px 16px', maxWidth:260 }}>
        <p style={{
          fontFamily:'var(--font-display)', fontSize:13, fontWeight:600,
          color:'var(--text-1)', margin:0, lineHeight:1.35,
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        }}>
          {article.title}
        </p>
        <p style={{
          fontFamily:'var(--font-body)', fontSize:11,
          color:'var(--text-3)', margin:'2px 0 0',
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        }}>
          /{article.slug}
        </p>
      </td>

      {/* Category */}
      <td style={{ padding:'12px 16px' }}>
        <span style={{
          fontFamily:'var(--font-display)', fontSize:11,
          color:'var(--text-2)', letterSpacing:'0.04em',
        }}>
          {article.category || '—'}
        </span>
      </td>

      {/* Difficulty */}
      <td style={{ padding:'12px 16px' }}>
        <DiffBadge value={article.difficulty} />
      </td>

      {/* Status */}
      <td style={{ padding:'12px 16px' }}>
        <StatusBadge isPublished={article.isPublished} />
      </td>

 <td style={{ padding:'12px 16px' }}>
  <div style={{ display:'flex', gap:6 }}>
    <ActionBtn icon={Pencil} onClick={() => onEdit(article)} label="Edit article" />
    <ActionBtn icon={Trash2} onClick={() => onDelete(article)} label="Delete article" danger />
  </div>
</td>
    </motion.tr>
  )
}

/* ── Mobile card ─────────────────────────────────────────────── */
function MobileCard({ article, onEdit, onDelete, index }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.05, duration:0.3, ease:'easeOut' }}
      style={{
        padding:'1rem', borderRadius:12,
        background:'var(--surface-2)', border:'1px solid var(--border)',
      }}
        onClick={() => router.push(`/learn/${article.slug}`)} 
    >
      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <CoverThumb src={article.coverImageUrl} title={article.title} />
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            fontFamily:'var(--font-display)', fontSize:13, fontWeight:600,
            color:'var(--text-1)', margin:0, lineHeight:1.35,
          }}>
            {article.title}
          </p>
          <p style={{ fontFamily:'var(--font-body)', fontSize:11, color:'var(--text-3)', margin:'2px 0 0' }}>
            /{article.slug}
          </p>
        </div>
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <ActionBtn icon={Pencil} onClick={() => onEdit(article)} label="Edit" />
          <ActionBtn icon={Trash2} onClick={() => onDelete(article)} label="Delete" danger />
        </div>
      </div>

      <div style={{
        display:'flex', flexWrap:'wrap', gap:6,
        marginTop:10, paddingTop:10, borderTop:'1px solid var(--border)',
      }}>
        {article.category && (
          <span style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--text-3)', letterSpacing:'0.06em' }}>
            {article.category}
          </span>
        )}
        <DiffBadge value={article.difficulty} />
        <StatusBadge isPublished={article.isPublished} />
      </div>
    </motion.div>
  )
}

/* ── Main export ─────────────────────────────────────────────── */
export function LearnTable({ articles, onEdit, onDelete }) {
  const TH_STYLE = {
    padding:'10px 16px', textAlign:'left',
    fontFamily:'var(--font-display)', fontSize:10, fontWeight:700,
    color:'var(--text-3)', letterSpacing:'0.14em', textTransform:'uppercase',
    borderBottom:'1px solid var(--border)',
    background:'var(--surface-2)',
    whiteSpace:'nowrap',
  }

  return (
    <>
      <style>{`
        .lt-desktop { display:block; }
        .lt-mobile  { display:none; }
        @media (max-width:720px) {
          .lt-desktop { display:none; }
          .lt-mobile  { display:flex; flex-direction:column; gap:0.75rem; }
        }
      `}</style>

      {/* Desktop table */}
      <div className="lt-desktop" style={{ borderRadius:12, overflow:'hidden', border:'1px solid var(--border)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
          <colgroup>
            <col style={{ width:72 }} />
            <col />
            <col style={{ width:130 }} />
            <col style={{ width:130 }} />
            <col style={{ width:110 }} />
            <col style={{ width:90 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={TH_STYLE}>Cover</th>
              <th style={TH_STYLE}>Title</th>
              <th style={TH_STYLE}>Category</th>
              <th style={TH_STYLE}>Difficulty</th>
              <th style={TH_STYLE}>Status</th>
              <th style={TH_STYLE}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ background:'var(--surface-1)' }}>
            <AnimatePresence>
              {articles.map((a, i) => (
                <TableRow
                  key={a._id}
                  article={a}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lt-mobile">
        {articles.map((a, i) => (
          <MobileCard
            key={a._id}
            article={a}
            onEdit={onEdit}
            onDelete={onDelete}
            index={i}
          />
        ))}
      </div>
    </>
  )
}