'use client'
import { createPortal } from 'react-dom'
import { useState, useEffect, useCallback } from 'react'
import { X, Cpu, CheckSquare, LayoutList } from 'lucide-react'
import { useCheckCompatibilityMutation, useCreateBuildFromScratchMutation } from '@/services/buildlabApi'
import { PartsSelector } from './PartsSelector.jsx'
import { SelectedParts } from './SelectedParts.jsx'
import { SummaryPanel } from './SummaryPannel.jsx'
import { BuildSuccessPanel } from './BuildSuccessPanel.jsx'

function extractPartsFromBuild(build) {
  if (!build?.parts) return {}
  const result = {}
  const p = build.parts
  const resolve = (entry) => {
    if (!entry) return null
    const comp = entry.component ?? entry
    if (comp?._id) return comp
    return null
  }
  if (p.cpu)         result.cpu         = resolve(p.cpu)
  if (p.gpu)         result.gpu         = resolve(p.gpu)
  if (p.ram)         result.ram         = resolve(p.ram)
  if (p.motherboard) result.motherboard = resolve(p.motherboard)
  if (p.psu)         result.psu         = resolve(p.psu)
  if (p.cabinet)     result.cabinet     = resolve(p.cabinet)
  if (p.cooling)     result.cooling     = resolve(p.cooling)
  if (Array.isArray(p.storage) && p.storage.length > 0) {
    result.storage = resolve(p.storage[0])
  } else if (p.storage) {
    result.storage = resolve(p.storage)
  }
  return result
}

const TABS = [
  { key: 'parts',    label: 'Parts',    icon: Cpu        },
  { key: 'selected', label: 'Selected', icon: CheckSquare },
  { key: 'summary',  label: 'Summary',  icon: LayoutList  },
]

function MobileTabBar({ active, onChange }) {
  return (
    <div
      className="flex lg:hidden flex-shrink-0"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors duration-150"
            style={{
              color:        isActive ? 'var(--red)' : 'var(--text-3)',
              borderBottom: isActive ? '2px solid var(--red)' : '2px solid transparent',
              fontFamily:   'var(--font-display)',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function BuildPanel({ isOpen, onClose, prebuiltData }) {

  const [selectedParts,       setSelectedParts]       = useState({})
  const [compatibilityStatus, setCompatibilityStatus] = useState('idle')
  const [compatResult,        setCompatResult]        = useState(null)
  const [isChecking,          setIsChecking]          = useState(false)
  const [isCreating,          setIsCreating]          = useState(false)
  const [buildCreated,        setBuildCreated]        = useState(false)
  const [createdBuildId,      setCreatedBuildId]      = useState(null)
  const [mobileTab,           setMobileTab]           = useState('parts')

  const [checkCompatibility]     = useCheckCompatibilityMutation()
  const [createBuildFromScratch] = useCreateBuildFromScratchMutation()

  useEffect(() => {
    if (prebuiltData) {
      const parts = extractPartsFromBuild(prebuiltData)
      setSelectedParts(parts)
      resetFlow()
    }
  }, [prebuiltData])

  useEffect(() => {
    if (isOpen && !prebuiltData) {
      setSelectedParts({})
      resetFlow()
    }
  }, [isOpen]) 

useEffect(() => {
  const body = document.body
  const html = document.documentElement

  if (isOpen) {
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
  } else {
    body.style.overflow = ''
    html.style.overflow = ''
  }

  return () => {
    body.style.overflow = ''
    html.style.overflow = ''
  }
}, [isOpen])

  const resetFlow = () => {
    setCompatibilityStatus('idle')
    setCompatResult(null)
    setIsChecking(false)
    setIsCreating(false)
    setBuildCreated(false)
    setCreatedBuildId(null)
    setMobileTab('parts')
  }

  const handleSelectPart = useCallback((slotKey, component) => {
    setSelectedParts(prev => {
      if (!component) {
        const next = { ...prev }
        delete next[slotKey]
        return next
      }
      return { ...prev, [slotKey]: component }
    })
    setCompatibilityStatus('idle')
    setCompatResult(null)
  }, [])

  const handleRemovePart = useCallback((slotKey) => {
    setSelectedParts(prev => {
      const next = { ...prev }
      delete next[slotKey]
      return next
    })
    setCompatibilityStatus('idle')
    setCompatResult(null)
  }, [])

  const handleCheckCompatibility = useCallback(async () => {
    const filledSlots = Object.entries(selectedParts).filter(([, v]) => v)
    if (filledSlots.length < 2) return
    setIsChecking(true)
    setCompatibilityStatus('checking')
    setCompatResult(null)
    try {
      const componentIds = filledSlots.map(([, comp]) => comp._id)
      const result       = await checkCompatibility({ componentIds }).unwrap()
      const data         = result?.data ?? result
      const valid        = data?.valid ?? data?.compatible ?? data?.isCompatible ?? false
      const blockers     = data?.blockers ?? data?.errors  ?? []
      const warnings     = data?.warnings ?? []
      const notes        = data?.notes    ?? []
      if (valid) {
        setCompatibilityStatus('pass')
        setCompatResult({ valid: true, blockers: [], warnings, notes })
      } else {
        setCompatibilityStatus('fail')
        setCompatResult({ valid: false, blockers, warnings, notes })
      }
    } catch (err) {
      setCompatibilityStatus('fail')
      setCompatResult({
        valid:    false,
        blockers: [err?.data?.message ?? 'Compatibility check failed. Please try again.'],
        warnings: [],
        notes:    [],
      })
    } finally {
      setIsChecking(false)
    }
  }, [selectedParts, checkCompatibility])

const handleCreateBuild = useCallback(async (buildName) => {
  if (compatibilityStatus !== 'pass') return

  setIsCreating(true)

  try {

    const payload = {
      title: buildName,

      parts: {
        cpu: selectedParts.cpu?._id || null,
        gpu: selectedParts.gpu?._id || null,
        ram: selectedParts.ram?._id || null,
        motherboard: selectedParts.motherboard?._id || null,

        storage: selectedParts.storage?._id
          ? [selectedParts.storage._id]
          : [],

        psu: selectedParts.psu?._id || null,
        cabinet: selectedParts.cabinet?._id || null,
        cooling: selectedParts.cooling?._id || null,
      }
    }

    console.log('payload being sent:', payload)

    const result = await createBuildFromScratch(payload).unwrap()

    console.log('API response:', result)

    const id =
      result?.data?._id ??
      result?.data?.id ??
      result?._id ??
      result?.id ??
      null

    setBuildCreated(true)
    setCreatedBuildId(id)

  } catch (err) {

    console.error('Create build error:', err)

    setCompatibilityStatus('fail')

    setCompatResult({
      valid: false,
      blockers: [
        err?.data?.message ??
        'Failed to create build. Please try again.'
      ],
      warnings: [],
      notes: [],
    })

  } finally {
    setIsCreating(false)
  }

}, [compatibilityStatus, selectedParts, createBuildFromScratch])

  const handleStartNew = () => {
    setSelectedParts({})
    resetFlow()
  }

  if (!isOpen) return null

  const panel=(

    <div
 className="fixed inset-0 z-50 flex flex-col overflow-hidden"
  style={{
    background: 'var(--bg)',
    height: '100dvh',
  }}
>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 sm:px-5 flex-shrink-0"
        style={{
          height:       '56px',
          minHeight:    '56px',
          borderBottom: '1px solid var(--border)',
          background:   'var(--surface-1)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex-shrink-0"
            style={{
              background: 'rgba(255,59,31,0.1)',
              border:     '1px solid rgba(255,59,31,0.25)',
              color:      'var(--red)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <Cpu size={11} />
          
            <span className="hidden xs:inline">{prebuiltData ? 'Edit Template' : 'Build from Scratch'}</span>
            <span className="xs:hidden">{prebuiltData ? 'Edit' : 'Build'}</span>
          </span>
          {prebuiltData?.title && (
            <span
              className="hidden sm:block text-sm font-medium truncate"
              style={{
                color:      'var(--text-2)',
                fontFamily: 'var(--font-display)',
                maxWidth:   'min(260px, 30vw)',  
              }}
            >
              {prebuiltData.title}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close build panel"
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
          style={{ color: 'var(--text-2)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.background = 'var(--surface-2)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Mobile tab bar ──────────────────────────────────── */}
      <MobileTabBar active={mobileTab} onChange={setMobileTab} />

      {/* ── Main content ────────────────────────────────────── */}
      {/*
        ✦ KEY FIX: overflow-hidden here (not overflow-y-auto).
           Each child region owns its own scroll independently.
           This prevents the double-scroll / stuck-page feeling.
      */}
      
      <div className="flex-1 min-h-0 flex overflow-hidden">

       
<div
  className="hidden lg:grid lg:grid-cols-3 flex-1 min-h-0 w-full"
>
  
  {/* Col 1 — Parts selector */}
  <div
    className="h-full min-h-0 flex flex-col"
    style={{ borderRight: '1px solid var(--border)' }}
  >
    {/* SCROLL WRAPPER */}
<div
 data-lenis-prevent
  className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 pb-10 space-y-6">      <PartsSelector
        selectedParts={selectedParts}
        onSelectPart={handleSelectPart}
      />
    </div>
  </div>

  {/* Col 2 — Selected parts */}
  <div
    className="h-full min-h-0 flex flex-col"
    style={{ borderRight: '1px solid var(--border)' }}
  >
<div
 data-lenis-prevent
  className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 pb-10 space-y-6">      <SelectedParts
        selectedParts={selectedParts}
        onRemovePart={handleRemovePart}
      />
    </div>
  </div>

  {/* Col 3 — Summary / Success */}
  <div className="h-full min-h-0 flex flex-col">
<div
 data-lenis-prevent
  className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 pb-10 space-y-6">    
  {buildCreated ? (
        <BuildSuccessPanel
          createdBuildId={createdBuildId}
          onStartNew={handleStartNew}
        />
      ) : (
        <SummaryPanel
          selectedParts={selectedParts}
          compatibility={compatibilityStatus}
          compatResult={compatResult}
          isChecking={isChecking}
          isCreating={isCreating}
          onCheckCompatibility={handleCheckCompatibility}
          onCreateBuild={handleCreateBuild}
        />
      )}
    </div>
  </div>

</div>

        {/* ── Mobile: single tab view ────────────────────────── */}
        {/*
          ✦ h-full + overflow-y-auto: fills the parent and scrolls independently.
          ✦ pb-8 so last card isn't flush against the bottom edge.
        */}
<div 
 data-lenis-prevent
className="lg:hidden flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 pb-8">         {mobileTab === 'parts' && (
            <PartsSelector
              selectedParts={selectedParts}
              onSelectPart={handleSelectPart}
            />
          )}
          {mobileTab === 'selected' && (
            <SelectedParts
              selectedParts={selectedParts}
              onRemovePart={handleRemovePart}
            />
          )}
          {mobileTab === 'summary' && (
            buildCreated ? (
              <BuildSuccessPanel
                createdBuildId={createdBuildId}
                onStartNew={handleStartNew}
              />
            ) : (
              <SummaryPanel
                selectedParts={selectedParts}
                compatibility={compatibilityStatus}
                compatResult={compatResult}
                isChecking={isChecking}
                isCreating={isCreating}
                onCheckCompatibility={handleCheckCompatibility}
                onCreateBuild={handleCreateBuild}
              />
            )
          )}
        </div>

      </div>
    </div>
  
  )

  return createPortal(panel, document.body)

 

}