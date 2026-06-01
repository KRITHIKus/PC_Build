'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, ImageOff, Loader2, CheckCircle2, RefreshCw } from 'lucide-react'
import { useCreateArticleMutation, useUpdateArticleMutation, useUploadImageMutation } from '@/services/admin/learningApi'
import { LearnEditor } from './LearnEditor'

/* ── Shared input styles ─────────────────────────────────────── */
const INPUT = {
  width:'100%', borderRadius:8,
  padding:'9px 12px',
  background:'var(--surface-1)', border:'1px solid var(--border)',
  color:'var(--text-1)', fontFamily:'var(--font-body)', fontSize:13,
  outline:'none', transition:'border-color 0.18s',
  boxSizing:'border-box',
}
const LABEL = {
  display:'block', fontFamily:'var(--font-display)',
  fontSize:11, fontWeight:600, color:'var(--text-3)',
  letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6,
}

/* ── Field wrapper ───────────────────────────────────────────── */
function Field({ label, children, style }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', ...style }}>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  )
}

/* ── Focus helpers ───────────────────────────────────────────── */
function focusOn(e)  { e.target.style.borderColor = 'var(--red-border)' }
function focusOff(e) { e.target.style.borderColor = 'var(--border)'     }

/* ── Default form state ──────────────────────────────────────── */
const EMPTY = {
  title:'', slug:'', category:'', difficulty:'beginner',
  summary:'', content:'', coverImageUrl:'', tags:'', isPublished:false,
}

/* ── Build form state from an article object ─────────────────── */
function buildForm(article) {
  if (!article) return EMPTY
  return {
    title:         article.title         ?? '',
    slug:          article.slug          ?? '',
    category:      article.category      ?? '',
    difficulty:    article.difficulty    ?? 'beginner',
    summary:       article.summary       ?? '',
    content:       article.content       ?? '',        // ← the key field
    coverImageUrl: article.coverImageUrl ?? '',
    tags:          Array.isArray(article.tags)
                     ? article.tags.join(', ')
                     : (article.tags ?? ''),
    isPublished:   article.isPublished   ?? false,
  }
}

/* ── Slug auto-generate ──────────────────────────────────────── */
const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').slice(0,80)

/* ── Main export ─────────────────────────────────────────────── */
export function LearnForm({ article, onClose, onSuccess }) {
  const isEdit = Boolean(article)

  /*
   * ─── FIX ───────────────────────────────────────────────────────
   * Previously: useState(EMPTY)
   *   → first render always has form.content = ''
   *   → LearnEditor mounts with value = ''
   *   → useEditor initialises with empty content
   *   → useEffect([article]) fires AFTER mount, updates form.content
   *   → editor sync fires but races with useEditor async init → content missing
   *
   * Fix: lazy initialiser reads article immediately
   *   → first render already has form.content = article.content
   *   → useEditor initialises with the correct HTML from the start
   *   → no race condition, no sync needed
   * ───────────────────────────────────────────────────────────────
   */
  const [form, setForm] = useState(() => buildForm(article))

  const [imgFile,     setImgFile]     = useState(null)
  const [imgPreview,  setImgPreview]  = useState('')
  const [imgUploaded, setImgUploaded] = useState(false)
  const [imgErr,      setImgErr]      = useState(false)
  const fileRef = useRef(null)

  const [createArticle, { isLoading:isCreating }] = useCreateArticleMutation()
  const [updateArticle, { isLoading:isUpdating }] = useUpdateArticleMutation()
  const [uploadImage,   { isLoading:isUploading }] = useUploadImageMutation()

  const isSaving = isCreating || isUpdating

  /*
   * Keep useEffect for article switching — if the same LearnForm instance
   * receives a different article prop (e.g. user opens edit for article B
   * while form is still mounted from article A), re-sync the form.
   */
  useEffect(() => {
    setForm(buildForm(article))
    setImgFile(null)
    setImgPreview('')
    setImgUploaded(false)
    setImgErr(false)
  }, [article])

  /* ── Field setters ── */
  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'title' && !isEdit) next.slug = toSlug(val)
      return next
    })
  }

  /* ── Step 1: User picks a file ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgFile(file)
    setImgUploaded(false)
    setImgErr(false)
    const localUrl = URL.createObjectURL(file)
    setImgPreview(localUrl)
    setForm(prev => ({ ...prev, coverImageUrl: '' }))
    e.target.value = ''
  }

  /* ── Step 2: Explicit upload button click ── */
  const handleUploadImage = async () => {
    if (!imgFile) return
    try {
      const fd = new FormData()
      console.log(imgFile)
      console.log(imgFile instanceof File)
      fd.append('image', imgFile)
      const res = await uploadImage(fd).unwrap()
      console.log('UPLOAD RESPONSE:', res)
      if (!res?.coverImageUrl) throw new Error('Image URL missing from server response')
      setForm(prev => ({ ...prev, coverImageUrl: res.coverImageUrl }))
      setImgUploaded(true)
    } catch (err) {
      console.error('Image upload failed', err)
      setImgUploaded(false)
      alert(err?.data?.message || err?.message || 'Image upload failed')
    }
  }

  /* ── Re-pick a different image ── */
  const handleRePick = () => {
    setImgFile(null)
    setImgPreview('')
    setImgUploaded(false)
    setImgErr(false)
    setForm(prev => ({ ...prev, coverImageUrl: '' }))
    if (imgPreview.startsWith('blob:')) URL.revokeObjectURL(imgPreview)
  }

  /* ── Step 3: Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const tagsArr = form.tags
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []
    const payload = {
      title:         form.title,
      slug:          form.slug,
      category:      form.category,
      difficulty:    form.difficulty,
      summary:       form.summary,
      content:       form.content,
      coverImageUrl: form.coverImageUrl,
      tags:          tagsArr,
      isPublished:   form.isPublished,
    }
    try {
      if (isEdit) {
        await updateArticle({ id: article._id, ...payload }).unwrap()
      } else {
        await createArticle(payload).unwrap()
      }
      onSuccess?.()
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  /* ── Prevent body scroll ── */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const previewSrc = imgPreview || form.coverImageUrl

  return (
    <AnimatePresence>
      <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', justifyContent:'flex-end' }}>

        {/* Backdrop */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.25 }}
          onClick={onClose}
          style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}
        />

        {/* Panel */}
        <motion.aside
          initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
          transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}
          style={{
            position:'relative', zIndex:1,
            width:'clamp(320px, 90vw, 680px)', height:'100%',
            background:'var(--surface-2)', borderLeft:'1px solid var(--border)',
            display:'flex', flexDirection:'column', overflow:'hidden',
          }}
        >
          {/* Panel header */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)',
            background:'var(--surface-3)', flexShrink:0,
          }}>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--text-3)', letterSpacing:'0.14em', textTransform:'uppercase', margin:0 }}>
                {isEdit ? 'EDITING ARTICLE' : 'NEW ARTICLE'}
              </p>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--text-1)', margin:'2px 0 0', letterSpacing:'-0.02em' }}>
                {isEdit ? article.title?.slice(0,40) : 'Create Article'}
              </h2>
            </div>

            <button
              onClick={onClose}
              style={{
                width:32, height:32, borderRadius:8, border:'1px solid var(--border)',
                background:'var(--surface-2)', color:'var(--text-2)', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-strong)'; e.currentTarget.style.color='var(--text-1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-2)' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Scrollable form body */}
          <form
            onSubmit={handleSubmit}
            style={{ flex:1, overflowY:'auto', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1.1rem' }}
          >

            {/* Title */}
            <Field label="Title *">
              <input
                required value={form.title} onChange={set('title')}
                placeholder="Article title"
                style={INPUT}
                onFocus={focusOn} onBlur={focusOff}
              />
            </Field>

            {/* Slug */}
            <Field label="Slug">
              <input
                value={form.slug} onChange={set('slug')}
                placeholder="auto-generated-slug"
                style={{ ...INPUT, color:'var(--text-2)', fontFamily:'var(--font-display)', fontSize:12, letterSpacing:'0.02em' }}
                onFocus={focusOn} onBlur={focusOff}
              />
            </Field>

            {/* Category + Difficulty */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <Field label="Category">
                <select
                  value={form.category} onChange={set('category')}
                  style={{ ...INPUT, cursor:'pointer' }}
                  onFocus={focusOn} onBlur={focusOff}
                >
                  <option value="">Select…</option>
                  {['Guide','Tutorial','Reference','Build Tips','Reviews','News',"cpu", "gpu", "ram", "motherboard", "storage", "psu","cooling", "cabinet", "pc-building-basics", "Buying-guidance", "Troubleshooting"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Difficulty">
                <select
                  value={form.difficulty} onChange={set('difficulty')}
                  style={{ ...INPUT, cursor:'pointer' }}
                  onFocus={focusOn} onBlur={focusOff}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </Field>
            </div>

            {/* Summary */}
            <Field label="Summary">
              <textarea
                value={form.summary} onChange={set('summary')}
                rows={3} placeholder="Short description for preview…"
                style={{ ...INPUT, resize:'vertical', lineHeight:1.6 }}
                onFocus={focusOn} onBlur={focusOff}
              />
            </Field>

            {/* Content (Tiptap) */}
            <Field label="Content *">
              <LearnEditor
                key={article?._id ?? 'new'}
                value={form.content}
                onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
              />
            </Field>

            {/* ── Cover image — 3-step flow ── */}
            <Field label="Cover Image">

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display:'none' }}
                onChange={handleFileChange}
              />

              {/* State A: nothing selected yet */}
              {!previewSrc && !imgErr && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width:'100%', padding:'1.5rem',
                    borderRadius:10, cursor:'pointer',
                    border:'2px dashed var(--border)',
                    background:'var(--surface-1)',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                    transition:'border-color 0.18s, background 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-strong)'; e.currentTarget.style.background='var(--surface-2)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--surface-1)' }}
                >
                  <Upload size={22} style={{ color:'var(--text-3)' }} />
                  <span style={{ fontFamily:'var(--font-display)', fontSize:11, color:'var(--text-3)', letterSpacing:'0.06em' }}>
                    Click to choose a cover image
                  </span>
                </button>
              )}

              {/* State B: preview available */}
              {previewSrc && !imgErr && (
                <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--border)', background:'var(--surface-1)' }}>
                  <div style={{ position:'relative' }}>
                    <img
                      src={previewSrc}
                      alt="Cover preview"
                      onError={() => setImgErr(true)}
                      style={{ width:'100%', maxHeight:180, objectFit:'cover', display:'block' }}
                    />
                    {imgUploaded && (
                      <div style={{
                        position:'absolute', top:8, right:8,
                        background:'rgba(0,0,0,0.65)', borderRadius:20,
                        padding:'3px 8px 3px 6px',
                        display:'flex', alignItems:'center', gap:4,
                      }}>
                        <CheckCircle2 size={12} style={{ color:'#4ade80' }} />
                        <span style={{ fontFamily:'var(--font-display)', fontSize:10, color:'#4ade80', letterSpacing:'0.06em' }}>UPLOADED</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display:'flex', gap:8, padding:'10px 12px', borderTop:'1px solid var(--border)', background:'var(--surface-2)' }}>
                    <button
                      type="button" onClick={handleRePick} disabled={isUploading}
                      style={{
                        display:'inline-flex', alignItems:'center', gap:5,
                        padding:'6px 12px', borderRadius:7, cursor:'pointer',
                        background:'var(--surface-3)', border:'1px solid var(--border)',
                        color:'var(--text-2)', fontFamily:'var(--font-display)',
                        fontSize:11, fontWeight:600, letterSpacing:'0.04em', transition:'all 0.16s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-strong)'; e.currentTarget.style.color='var(--text-1)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-2)' }}
                    >
                      <RefreshCw size={11} /> Change
                    </button>

                    {!imgUploaded && (
                      <button
                        type="button" onClick={handleUploadImage} disabled={isUploading}
                        style={{
                          flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
                          padding:'6px 14px', borderRadius:7, cursor: isUploading ? 'not-allowed' : 'pointer',
                          background: isUploading ? 'rgba(255,59,31,0.4)' : 'var(--red)',
                          border:'none', color:'#fff',
                          fontFamily:'var(--font-display)', fontSize:11, fontWeight:700,
                          letterSpacing:'0.04em',
                          boxShadow: isUploading ? 'none' : '0 0 12px var(--red-glow)',
                          transition:'all 0.18s',
                        }}
                      >
                        {isUploading
                          ? <><Loader2 size={11} style={{ animation:'spin 0.75s linear infinite' }} /> Uploading…</>
                          : <><Upload size={11} /> Upload Image</>
                        }
                      </button>
                    )}

                    {imgUploaded && (
                      <button
                        type="button" onClick={handleUploadImage} disabled={isUploading}
                        style={{
                          display:'inline-flex', alignItems:'center', gap:5,
                          padding:'6px 12px', borderRadius:7, cursor:'pointer',
                          background:'rgba(255,59,31,0.08)', border:'1px solid var(--red-border)',
                          color:'var(--red)', fontFamily:'var(--font-display)',
                          fontSize:11, fontWeight:600, letterSpacing:'0.04em', transition:'all 0.16s',
                        }}
                      >
                        <RefreshCw size={11} /> Re-upload
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* State C: error */}
              {imgErr && (
                <div style={{
                  padding:'1.25rem', borderRadius:10,
                  border:'1px solid var(--border)', background:'var(--surface-1)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                }}>
                  <ImageOff size={22} style={{ color:'var(--text-3)' }} />
                  <span style={{ fontFamily:'var(--font-display)', fontSize:11, color:'var(--text-3)', letterSpacing:'0.06em' }}>Preview unavailable</span>
                  <button
                    type="button"
                    onClick={() => { setImgErr(false); fileRef.current?.click() }}
                    style={{
                      padding:'5px 12px', borderRadius:6, cursor:'pointer',
                      background:'var(--surface-3)', border:'1px solid var(--border)',
                      color:'var(--text-2)', fontFamily:'var(--font-display)', fontSize:11,
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}

              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

              {imgFile && !imgUploaded && !isUploading && (
                <p style={{
                  margin:'6px 0 0', fontFamily:'var(--font-display)', fontSize:10,
                  color:'var(--text-3)', letterSpacing:'0.05em',
                  display:'flex', alignItems:'center', gap:4,
                }}>
                  <span style={{ color:'var(--red)', fontSize:14, lineHeight:1 }}>·</span>
                  Upload the image before saving the article
                </p>
              )}

              {imgUploaded && form.coverImageUrl && (
                <p style={{
                  margin:'6px 0 0', fontFamily:'var(--font-display)', fontSize:10,
                  color:'var(--text-3)', letterSpacing:'0.04em',
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                }}>
                  URL: {form.coverImageUrl}
                </p>
              )}
            </Field>

            {/* Tags */}
            <Field label="Tags (comma-separated)">
              <input
                value={form.tags} onChange={set('tags')}
                placeholder="e.g. gaming, budget, amd"
                style={INPUT}
                onFocus={focusOn} onBlur={focusOff}
              />
            </Field>

            {/* Published toggle */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'12px 14px', borderRadius:10,
              background:'var(--surface-1)', border:'1px solid var(--border)',
            }}>
              <div>
                <p style={{ fontFamily:'var(--font-display)', fontSize:12, fontWeight:600, color:'var(--text-1)', margin:0 }}>Publish Article</p>
                <p style={{ fontFamily:'var(--font-body)', fontSize:11, color:'var(--text-3)', margin:'2px 0 0' }}>
                  {form.isPublished ? 'Visible to all users' : 'Saved as draft'}
                </p>
              </div>
              <label style={{ position:'relative', display:'inline-flex', alignItems:'center', cursor:'pointer' }}>
                <input
                  type="checkbox" checked={form.isPublished} onChange={set('isPublished')}
                  style={{ position:'absolute', opacity:0, width:0, height:0 }}
                />
                <div style={{
                  width:44, height:24, borderRadius:12,
                  background: form.isPublished ? 'var(--red)' : 'var(--border-strong)',
                  transition:'background 0.2s ease',
                  boxShadow: form.isPublished ? '0 0 12px var(--red-glow)' : 'none',
                  position:'relative',
                }}>
                  <div style={{
                    position:'absolute', top:2,
                    left: form.isPublished ? 22 : 2,
                    width:20, height:20, borderRadius:'50%',
                    background:'#fff',
                    transition:'left 0.2s ease',
                    boxShadow:'0 1px 4px rgba(0,0,0,0.4)',
                  }} />
                </div>
              </label>
            </div>

            <div style={{ height:4 }} />
          </form>

          {/* Footer actions */}
          <div style={{
            padding:'1rem 1.25rem', borderTop:'1px solid var(--border)',
            background:'var(--surface-3)', display:'flex', gap:10, flexShrink:0,
          }}>
            <button
              type="button" onClick={onClose} disabled={isSaving}
              style={{
                flex:1, padding:'10px', borderRadius:9,
                background:'var(--surface-2)', border:'1px solid var(--border)',
                color:'var(--text-2)', fontFamily:'var(--font-display)',
                fontSize:13, fontWeight:600, cursor:'pointer', letterSpacing:'0.02em',
              }}
            >
              Cancel
            </button>

            <button
              type="submit" onClick={handleSubmit} disabled={isSaving}
              style={{
                flex:1, padding:'10px', borderRadius:9,
                background: isSaving ? 'rgba(255,59,31,0.5)' : 'var(--red)',
                border:'none', color:'#fff',
                fontFamily:'var(--font-display)', fontSize:13, fontWeight:700,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                letterSpacing:'0.02em', display:'flex', alignItems:'center',
                justifyContent:'center', gap:7,
                boxShadow: isSaving ? 'none' : '0 0 16px var(--red-glow)',
                transition:'all 0.2s ease',
              }}
            >
              {isSaving && <Loader2 size={13} style={{ animation:'spin 0.8s linear infinite' }} />}
              {isSaving ? 'Saving…' : isEdit ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  )
}