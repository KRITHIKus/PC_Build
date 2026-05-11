'use client'

import { useState } from 'react'
import PricingForm from '@/components/admin/pricing/PricingForm.jsx'
import PricingHistory from '@/components/admin/pricing/PricingHistory.jsx'
import LatestPrice from '@/components/admin/pricing/LatestPrice.jsx'
import ComponentSelector from '@/components/admin/ComponentSelector.jsx'
import PricingChart from '@/components/admin/pricing/PricingChart.jsx'

export default function PricingPage() {
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [region, setRegion] = useState('')

  const handleRefresh = () => setRefreshKey((prev) => prev + 1)

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl w-full">

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1
          className="text-xl font-semibold"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
        >
          Pricing Management
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Track and manage component pricing across regions
        </p>
      </div>

      {/* REGION + COMPONENT SELECTOR CARD */}
      <div
        className="rounded-xl flex flex-col gap-0"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
      >
        {/* Region row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <label
            className="text-xs font-semibold uppercase tracking-wider flex-shrink-0"
            style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
          >
            Region
          </label>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              setSelectedComponent(null)
            }}
            className="h-9 px-3 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: region ? 'var(--text-1)' : 'var(--text-3)',
              fontFamily: 'var(--font-display)',
              minWidth: '180px',
            }}
          >
            <option value="">Select Region</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* Component selector */}
        <div className="px-4 py-3">
          {!region ? (
            <div
              className="flex items-center justify-center py-5 rounded-lg text-xs"
              style={{
                color: 'var(--text-3)',
                background: 'var(--surface-2)',
                border: '1px dashed var(--border)',
              }}
            >
              Select a region to browse components
            </div>
          ) : (
            <ComponentSelector
              value={selectedComponent}
              onChange={setSelectedComponent}
              region={region}
            />
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      {!selectedComponent ? (
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            minHeight: '260px',
            background: 'var(--surface-1)',
            border: '1px dashed var(--border)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            {!region
              ? 'Select a region and component to get started'
              : 'Select a component to view pricing data'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4">
            <LatestPrice
              componentId={selectedComponent._id}
              region={region}
            />
            <PricingForm
              componentId={selectedComponent._id}
              region={region}
              onSuccess={handleRefresh}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <PricingChart
              componentId={selectedComponent._id}
              region={region}
              refreshKey={refreshKey}
            />
            <PricingHistory
              componentId={selectedComponent._id}
              region={region}
              refreshKey={refreshKey}
            />
          </div>

        </div>
      )}
    </div>
  )
}