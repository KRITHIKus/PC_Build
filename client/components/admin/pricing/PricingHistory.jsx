'use client'

import PriceHistoryList from './PriceHistoryList.jsx'

export default function PricingHistory({ componentId, refreshKey, region }) {
  if (!componentId) return null

  return (
    <PriceHistoryList
      componentId={componentId}
      refreshKey={refreshKey}
      region={region}
    />
  )
}