import { useState } from 'react'
import {
  CheckCircle2,
  Sparkles,
  Package,
  Building2,
  MessageSquare,
} from 'lucide-react'
import { MatchScorePill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COMPATIBILITY_MATCHES } from '@/data/mock-data'
import { useNavigate } from 'react-router-dom'
import type { CompatibilityMatch } from '@/types/matching'

export function CompatibilityMatchesPage() {
  const navigate = useNavigate()
  const [matches] = useState<CompatibilityMatch[]>(COMPATIBILITY_MATCHES)
  const [selectedMatch, setSelectedMatch] = useState<CompatibilityMatch>(matches[0])

  const handleMessageBuyer = () => {
    navigate(
      `/inquiries?match=${selectedMatch.id}&buyer=${encodeURIComponent(
        selectedMatch.demandTender.organizationName
      )}&crop=${encodeURIComponent(selectedMatch.supplyBatch.commodityName)}`
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Recommended Buyer Matches
            </h1>
            <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-bold text-[#15803d]">
              {matches.length} Verified Matches
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            We pair your stored crops with buyers whose factory demands match your grain type, moisture, and location.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#15803d] bg-[#f0fdf4] px-3.5 py-2 rounded-xl border border-[#bbf7d0]">
          <Sparkles className="h-4 w-4" />
          <span>Automatic matchmaking active</span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Match Cards List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase px-1">
            Tap a match to see deal details:
          </p>

          {matches.map((m) => {
            const isSelected = selectedMatch.id === m.id
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatch(m)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-xs ${
                  isSelected
                    ? 'border-[#15803d] bg-[#f0fdf4] ring-2 ring-[#15803d]/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-[#15803d] text-xs">
                    {m.supplyBatch.commodityName}
                  </span>
                  <MatchScorePill score={m.overallScore} />
                </div>

                <div className="text-sm font-extrabold text-gray-900">
                  {m.demandTender.organizationName}
                </div>

                <p className="text-xs text-gray-600 mt-1">
                  They need <strong>{m.demandTender.requiredQuantityMT} Tonnes</strong> in{' '}
                  {m.demandTender.deliveryLocation.state} State
                </p>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[#15803d] font-bold">
                    You can supply {m.breakdown.volumeFulfillableMT} Tonnes
                  </span>
                  <span className="text-gray-400 font-semibold">{m.breakdown.distanceKm} km route</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Match Details & Comparison (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase">
                Deal Match Comparison
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">
                {selectedMatch.supplyBatch.commodityName}
              </h2>
            </div>
            <MatchScorePill score={selectedMatch.overallScore} />
          </div>

          {/* Simple Side-by-Side Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* What you have */}
            <div className="p-4 rounded-xl bg-[#f8faf7] border border-gray-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803d] uppercase mb-2">
                <Package className="h-4 w-4" />
                <span>What You Have</span>
              </div>
              <p className="font-extrabold text-gray-900 text-sm">
                {selectedMatch.supplyBatch.metricTonnes} Tonnes ({selectedMatch.supplyBatch.quantity} {selectedMatch.supplyBatch.unit})
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Variety: {selectedMatch.supplyBatch.variety}
              </p>
              <div className="mt-3 space-y-1 text-xs text-gray-600 pt-2 border-t border-gray-200">
                <p>📍 Location: {selectedMatch.supplyBatch.location.state} State</p>
                <p>💧 Moisture: {selectedMatch.supplyBatch.moistureContent}% (Safe & dry)</p>
              </div>
            </div>

            {/* What buyer wants */}
            <div className="p-4 rounded-xl bg-[#fef3c7]/40 border border-[#fde68a]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#b45309] uppercase mb-2">
                <Building2 className="h-4 w-4" />
                <span>What Buyer Wants</span>
              </div>
              <p className="font-extrabold text-gray-900 text-sm">
                {selectedMatch.demandTender.requiredQuantityMT} Tonnes Needed
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Buyer: {selectedMatch.demandTender.organizationName}
              </p>
              <div className="mt-3 space-y-1 text-xs text-gray-600 pt-2 border-t border-[#fde68a]">
                <p>📍 Receiving: {selectedMatch.demandTender.deliveryLocation.receivingHub}, {selectedMatch.demandTender.deliveryLocation.state}</p>
                <p>💰 Budget: ₦{(selectedMatch.demandTender.targetPricePerMT || 0).toLocaleString()} / Tonne</p>
              </div>
            </div>
          </div>

          {/* Clear checklist of why it's a match */}
          <div className="mb-6 p-4 rounded-xl bg-white border border-gray-200 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Why this is a great deal:
            </h3>

            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0" />
              <span>
                <strong>Crop is 100% identical:</strong> Both parties specified {selectedMatch.supplyBatch.variety}.
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0" />
              <span>
                <strong>Moisture is approved:</strong> Your {selectedMatch.supplyBatch.moistureContent}% is below the buyer's maximum ceiling of {selectedMatch.demandTender.acceptedMoistureMax}%.
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0" />
              <span>
                <strong>Direct transport corridor:</strong> {selectedMatch.breakdown.distanceKm} km transit between warehouses.
              </span>
            </div>
          </div>

          {/* Clear Action Button */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Ready to talk? Start a direct chat to agree on quantity and price.
            </span>
            <Button
              onClick={handleMessageBuyer}
              icon={<MessageSquare className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Message {selectedMatch.demandTender.organizationName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
