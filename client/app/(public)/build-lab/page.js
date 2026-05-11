'use client'

import { useState, useCallback } from 'react'
import { BuildLabHeader } from '@/components/buildlab/BuildLabHeader'
import { PrebuiltGrid }   from '@/components/buildlab/PrebuiltGrid'
import { BuildPanel }     from '@/components/buildlab/BuildPanel'

export default function BuildLabPage() {
  const [isPanelOpen,     setIsPanelOpen]     = useState(false)
  const [selectedPrebuilt, setSelectedPrebuilt] = useState(null)

  /* ── Open panel from scratch ─────────────────────────────── */
  const handleStartBuild = useCallback(() => {
    setSelectedPrebuilt(null)
    setIsPanelOpen(true)
  }, [])

  /* ── Open panel prefilled from a prebuilt card ───────────── */
  const handleUseAsBase = useCallback((build) => {
    setSelectedPrebuilt(build)
    setIsPanelOpen(true)
  }, [])

  /* ── Close panel ─────────────────────────────────────────── */
  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false)
    // Keep selectedPrebuilt so re-open is clean; reset only on fresh open
  }, [])

  return (
    <>
      <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        {/* Header — always visible */}
        <BuildLabHeader onStartBuild={handleStartBuild} />

        {/* Prebuilt templates grid */}
        <PrebuiltGrid onUseAsBase={handleUseAsBase} />
      </div>

      {/* Build Panel — full-screen overlay */}
      <BuildPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        prebuiltData={selectedPrebuilt}
      />
    </>
  )
}