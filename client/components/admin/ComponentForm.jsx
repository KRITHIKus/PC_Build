'use client'

import { useState, useEffect } from 'react'
import { X }                   from 'lucide-react'
import { useUploadImageMutation } from '@/services/admin/uploadApi'

import BasicInfo      from './ComponentsFormSections/BasicInfo.jsx'
import Details        from './ComponentsFormSections/Details.jsx'
import Pricing        from './ComponentsFormSections/Pricing.jsx'
import Tags           from './ComponentsFormSections/Tags.jsx'
import Specs          from './ComponentsFormSections/Specs.jsx'
import Compatibility  from './ComponentsFormSections/Compatibility.jsx'
import ComponentPreviewPanel from './ComponentPreviewPanel.jsx'

/* ── Default form state ──────────────────────────────────────── */
const EMPTY_FORM = {
  name:          '',
  brand:         '',
  model:         '',
  type:          '',
  image:         '',
  description:   '',
  estimatedPrice:'',
  currency:      'INR',
  inStock:       '',
  tags:          [],
  specs:         [],
  compatibility: [],
}

export default function ComponentForm({ initial, onSubmit, onCancel, loading }) {
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [imageFile,   setImageFile]   = useState(null)
  const [uploadError, setUploadError] = useState('')

  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation()

  /* ── Sync initial data ───────────────────────────────────── */
  useEffect(() => {
    if (initial) {
      setForm({
        name:          initial.name          || '',
        brand:         initial.brand         || '',
        model:         initial.model         || '',
        type:          initial.type          || '',
        image:         initial.image         || '',
        description:   initial.description   || '',
        estimatedPrice:initial.estimatedPrice != null ? String(initial.estimatedPrice) : '',
        currency:      initial.currency      || 'INR',
        inStock:       initial.inStock       != null ? String(initial.inStock) : '',
        tags:          Array.isArray(initial.tags)          ? initial.tags          : [],
        specs:         Array.isArray(initial.specs)         ? initial.specs         :
                       (initial.specs && typeof initial.specs === 'object'
                         ? Object.entries(initial.specs).map(([key, value]) => ({ key, value }))
                         : []),
        compatibility: Array.isArray(initial.compatibility) ? initial.compatibility :
                       (initial.compatibility && typeof initial.compatibility === 'object'
                         ? Object.entries(initial.compatibility).map(([key, value]) => ({ key, value }))
                         : []),
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setImageFile(null)
    setUploadError('')
  }, [initial])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setUploadError('')
  }

  /* ── Submit — identical API payload shape ─────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let imageUrl = form.image

      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
const res = await uploadImage({
  file: imageFile,
  folder: 'components',
  componentId: initial?._id
}).unwrap()     
   imageUrl  = res?.url || res?.imageUrl || res?.data?.url || ''
        if (!imageUrl) throw new Error('No image URL returned')
      }

      /* Build specs/compatibility as plain objects for the API */
      const specsObj = Object.fromEntries(
        form.specs.filter(r => r.key).map(({ key, value }) => [key, value])
      )
      const compatObj = Object.fromEntries(
        form.compatibility.filter(r => r.key).map(({ key, value }) => [key, value])
      )

      await onSubmit({
        /* original required fields — unchanged */
        name:    form.name.trim(),
        brand:   form.brand.trim(),
        type:    form.type.trim(),
        inStock: Number(form.inStock) || 0,
        image:   imageUrl,
        /* extended fields */
        model:         form.model.trim(),
        description:   form.description.trim(),
        estimatedPrice:form.estimatedPrice ? Number(form.estimatedPrice) : undefined,
        currency:      form.currency,
        tags:          form.tags,
        specs:         specsObj,
        compatibility: compatObj,
      })
    } catch (err) {
      console.error(err)
      setUploadError(err?.data?.message || err?.message || 'Something went wrong.')
    }
  }

  const busy = loading || uploading

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">

      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        onClick={!busy ? onCancel : undefined}
      />

      {/* Panel — wider for 2-col */}
      <div
        className="relative z-10 flex flex-col rounded-2xl shadow-2xl w-full"
        style={{
          background: 'var(--surface-1)',
          border:     '1px solid var(--border)',
          maxWidth:   '900px',
          maxHeight:  '92dvh',
        }}
      >

        {/* ── Header ──────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2
            className="text-base font-semibold"
            style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
          >
            {initial ? 'Edit Component' : 'Add Component'}
          </h2>
          <button
            type="button"
            onClick={!busy ? onCancel : undefined}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* Form column */}
          <div className="flex-1 min-w-0 overflow-y-auto p-6">
            <form id="comp-form" onSubmit={handleSubmit} className="flex flex-col gap-0">
              <BasicInfo     form={form} setForm={setForm} />
              <Details       form={form} setForm={setForm} imageFile={imageFile} onFileChange={handleFileChange} />
              <Pricing       form={form} setForm={setForm} />
              <Tags          form={form} setForm={setForm} />
              <Specs         form={form} setForm={setForm} />
              <Compatibility form={form} setForm={setForm} />

              {uploadError && (
                <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{uploadError}</p>
              )}
            </form>
          </div>

          {/* Preview column — desktop right, mobile bottom */}
          <div
            className="lg:w-72 lg:flex-shrink-0 overflow-y-auto p-6 pt-4"
            style={{
              borderTop:  'var(--border)',
              borderLeft: 'none',
            }}
          >
            {/* Mobile: top divider */}
            <div className="lg:hidden mb-4" style={{ borderTop: '1px solid var(--border)' }} />
            {/* Desktop: left divider via sticky panel */}
            <div
              className="hidden lg:block absolute top-0 bottom-0"
              style={{ left: 'calc(100% - 288px - 1px)', width: '1px', background: 'var(--border)' }}
            />
            <ComponentPreviewPanel form={form} imageFile={imageFile} />
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div
          className="flex gap-3 px-6 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 h-10 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: 'var(--surface-2)',
              color:      'var(--text-1)',
              border:     '1px solid var(--border)',
              cursor:     busy ? 'not-allowed' : 'pointer',
              opacity:    busy ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="comp-form"
            disabled={busy}
            className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: busy ? 'rgba(255,59,31,0.5)' : 'var(--red)',
              cursor:     busy ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-display)',
            }}
          >
            {busy
              ? uploading ? 'Uploading…' : 'Saving…'
              : initial ? 'Update' : 'Create'
            }
          </button>
        </div>

      </div>
    </div>
  )
}