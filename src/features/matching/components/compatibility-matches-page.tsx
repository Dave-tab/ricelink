import { useState } from 'react'
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Package,
} from 'lucide-react'
import { MatchScorePill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COMPATIBILITY_MATCHES } from '@/data/mock-data'
import { Link } from 'react-router-dom'
import type { CompatibilityMatch } from '@/types/matching'

export function CompatibilityMatchesPage() {
  const [matches] = useState<CompatibilityMatch[]>(COMPATIBILITY_MATCHES)
  const [selectedMatch, setSelectedMatch] = useState<CompatibilityMatch | null>(matches[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#143d2b]">
              Algorithmic Compatibility Matches
            </h1>
            <span className="rounded bg-[#c0edd2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#002113]">
              Deterministic Rule Engine
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Multi-factor evaluation pairing physical harvest batches with commercial tenders based on crop specifications, moisture limits, logistics distance, and volume feasibility.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
          <Sparkles className="h-4 w-4" />
          <span>Non-binding algorithmic recommendations</span>
        </div>
      </div>

      {/* Main Grid: Matches List and Detail Comparison Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matches List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              High-Compatibility Pairs ({matches.length})
            </span>
            <span className="text-[11px] text-gray-400">Ranked by overall match</span>
          </div>

          {matches.map((m) => {
            const isSelected = selectedMatch?.id === m.id
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatch(m)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-xs ${
                  isSelected
                    ? 'border-[#143d2b] bg-white ring-2 ring-[#143d2b]/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {m.supplyBatch.commodityName}
                  </span>
                  <MatchScorePill score={m.overallScore} />
                </div>

                <div className="text-sm font-extrabold text-gray-900">
                  {m.supplyBatch.organizationName}
                  <span className="text-gray-400 font-normal mx-1.5">⇄</span>
                  {m.demandTender.organizationName}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-bold text-[#143d2b] tabular-nums">
                    {m.breakdown.volumeFulfillableMT} MT fulfillable
                  </span>
                  <span>•</span>
                  <span>{m.breakdown.distanceKm} km transit</span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Moisture & Grade Compliant
                  </span>
                  <span className="font-bold text-gray-500">
                    {m.breakdown.volumePercentage.toFixed(0)}% of tender
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Match Comprehensive Evaluation (7 Cols) */}
        {selectedMatch && (
          <div className="lg:col-span-7 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Compatibility Diagnostic Dossier
                </span>
                <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                  {selectedMatch.supplyBatch.commodityName} Pairing
                </h2>
              </div>
              <div className="text-right">
                <MatchScorePill score={selectedMatch.overallScore} />
                <p className="text-[11px] text-gray-400 mt-1">Calculated via deterministic engine</p>
              </div>
            </div>

            {/* Side-by-Side Factor Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Supply Side */}
              <div className="p-4 rounded-xl bg-[#f8f9fa] border border-gray-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#143d2b] uppercase tracking-wider mb-2">
                  <Package className="h-4 w-4" />
                  <span>Physical Supply Batch</span>
                </div>
                <p className="font-extrabold text-gray-900 text-sm">
                  {selectedMatch.supplyBatch.batchCode}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {selectedMatch.supplyBatch.organizationName}
                </p>

                <div className="mt-3 space-y-1.5 text-xs text-gray-700 border-t border-gray-200 pt-2.5">
                  <div>
                    <span className="text-gray-500">Available: </span>
                    <span className="font-bold tabular-nums">
                      {selectedMatch.supplyBatch.metricTonnes} MT ({selectedMatch.supplyBatch.quantity} {selectedMatch.supplyBatch.unit})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Moisture: </span>
                    <span className="font-bold text-emerald-800">
                      {selectedMatch.supplyBatch.moistureContent}% MC
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location: </span>
                    <span>
                      {selectedMatch.supplyBatch.location.facilityName}, {selectedMatch.supplyBatch.location.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Demand Side */}
              <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#dce2f7]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#00195d] uppercase tracking-wider mb-2">
                  <Building2 className="h-4 w-4" />
                  <span>Procurement Tender</span>
                </div>
                <p className="font-extrabold text-gray-900 text-sm">
                  {selectedMatch.demandTender.tenderCode}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {selectedMatch.demandTender.organizationName}
                </p>

                <div className="mt-3 space-y-1.5 text-xs text-gray-700 border-t border-[#dce2f7] pt-2.5">
                  <div>
                    <span className="text-gray-500">Required: </span>
                    <span className="font-bold tabular-nums">
                      {selectedMatch.demandTender.requiredQuantityMT} MT
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Accepted Max MC: </span>
                    <span className="font-bold text-gray-900">
                      &lt;= {selectedMatch.demandTender.acceptedMoistureMax}% MC
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Intake Gate: </span>
                    <span>
                      {selectedMatch.demandTender.deliveryLocation.receivingHub}, {selectedMatch.demandTender.deliveryLocation.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Factor Breakdown Progress Bars */}
            <div className="space-y-3 mb-6 bg-[#f8f9fa] p-4 rounded-xl border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Evaluation Factor Matrix
              </h3>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-600">Commodity & Variety Compatibility</span>
                  <span className="text-emerald-800 font-bold">100% Fit</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-600">Moisture & Quality Compliance</span>
                  <span className="text-emerald-800 font-bold">
                    Passed (12.8% vs 13.5% Max)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-600">
                    Logistics Corridor ({selectedMatch.breakdown.distanceKm} km transit distance)
                  </span>
                  <span className="text-gray-800 font-bold">
                    {selectedMatch.breakdown.locationScore}% Proximity
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#143d2b] h-2 rounded-full"
                    style={{ width: `${selectedMatch.breakdown.locationScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-600">
                    Volume Capacity ({selectedMatch.breakdown.volumeFulfillableMT} MT of {selectedMatch.demandTender.requiredQuantityMT} MT)
                  </span>
                  <span className="text-gray-800 font-bold">
                    {selectedMatch.breakdown.volumePercentage.toFixed(1)}% Fulfillable
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, selectedMatch.breakdown.volumePercentage)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Direct Bilateral Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Action will open a bilateral negotiation channel in the Coordination Desk.
              </span>
              <div className="flex gap-2.5 w-full sm:w-auto">
                <Link to="/inquiries" className="w-full sm:w-auto">
                  <Button fullWidth icon={<ArrowRight className="h-4 w-4" />}>
                    Initiate Desk Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
