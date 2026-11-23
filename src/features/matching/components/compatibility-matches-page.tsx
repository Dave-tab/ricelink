
import { useState } from 'react'
import {
  Package,
  Building2,
  MessageSquare,
  MapPin,
  CalendarDays,
  Info,
  CheckCircle2,
  AlertCircle,
  CircleHelp,
  Play,
  RotateCcw,
} from 'lucide-react'
import { MatchScorePill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SUPPLY_BATCHES, DEMAND_TENDERS } from '@/data/mock-data'
import { generateCompatibilityMatches } from '@/lib/matching-engine'
import { useNavigate } from 'react-router-dom'
import type {
  CompatibilityMatch,
  LocationMatchTier,
  MatchScoreFactors,
} from '@/types/matching'

const FACTOR_CONFIG: {
  key: keyof MatchScoreFactors
  label: string
}[] = [
  { key: 'location', label: 'Location compatibility' },
  { key: 'quantity', label: 'Quantity fulfilment' },
  { key: 'quality', label: 'Quality requirements' },
  { key: 'variety', label: 'Variety preference' },
  { key: 'deliveryTiming', label: 'Delivery timing' },
]

const LOCATION_LABELS: Record<LocationMatchTier, string> = {
  same_lga: 'Same LGA',
  nearby_lga: 'Nearby LGA',
  same_state: 'Same state',
  neighbouring_state: 'Neighbouring state',
  wider_market: 'Wider market',
  unknown: 'Location unknown',
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-NG', {
    maximumFractionDigits: 2,
  })
}

function getAssessmentCoverage(factors?: MatchScoreFactors) {
  if (!factors) {
    return null
  }

  const entries = Object.values(factors)

  const totalWeight = entries.reduce(
    (total, factor) => total + factor.weight,
    0,
  )

  const assessedFactors = entries.filter(
    (factor) => factor.score !== null,
  )

  const assessedWeight = assessedFactors.reduce(
    (total, factor) => total + factor.weight,
    0,
  )

  if (totalWeight <= 0) {
    return null
  }

  return {
    assessedWeight,
    totalWeight,
    percentage: Math.round((assessedWeight / totalWeight) * 100),
  }
}

function getFactorStatusLabel(status: string): string {
  switch (status) {
    case 'met':
      return 'Met'
    case 'partial':
      return 'Partial'
    case 'not_met':
      return 'Not met'
    default:
      return 'Unknown'
  }
}

function getFactorStatusStyle(status: string): string {
  switch (status) {
    case 'met':
      return 'bg-green-50 text-green-700'
    case 'partial':
      return 'bg-amber-50 text-amber-700'
    case 'not_met':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function getFactorIcon(status: string) {
  switch (status) {
    case 'met':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'partial':
      return <AlertCircle className="h-4 w-4 text-amber-600" />
    case 'not_met':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <CircleHelp className="h-4 w-4 text-gray-400" />
  }
}

function getLocationLabel(match: CompatibilityMatch): string {
  const tier = match.breakdown.locationTier ?? 'unknown'
  return LOCATION_LABELS[tier]
}

function MatchFactorCard({
  label,
  weight,
  score,
  status,
  explanation,
}: {
  label: string
  weight: number
  score: number | null
  status: string
  explanation: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {getFactorIcon(status)}
          <div>
            <p className="text-sm font-bold text-gray-900">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Weight: {weight}%
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getFactorStatusStyle(status)}`}
          >
            {getFactorStatusLabel(status)}
          </span>
          <p className="text-sm font-extrabold text-gray-900 mt-1">
            {score === null ? 'Unknown' : `${score}%`}
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-gray-600 mt-3">
        {explanation}
      </p>

      {score !== null && (
        <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#15803d]"
            style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function CompatibilityMatchesPage() {
  const navigate = useNavigate()

  const [matches, setMatches] = useState<CompatibilityMatch[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [lastRunAt, setLastRunAt] = useState<string | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState('')

  const runMatchingEngine = () => {
    const results = generateCompatibilityMatches(
      SUPPLY_BATCHES,
      DEMAND_TENDERS,
    )

    setMatches(results)
    setHasRun(true)
    setSelectedMatchId(results[0]?.id ?? '')
    setLastRunAt(
      new Date().toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    )
  }

  const selectedMatch = matches.find(
    (match) => match.id === selectedMatchId,
  ) ?? matches[0]

  const selectedCoverage = getAssessmentCoverage(
    selectedMatch?.breakdown.factors,
  )

  const handleMessageBuyer = (match: CompatibilityMatch) => {
    navigate(
      `/inquiries?match=${encodeURIComponent(match.id)}&buyer=${encodeURIComponent(
        match.demandTender.organizationName,
      )}&crop=${encodeURIComponent(match.supplyBatch.commodityName)}`,
    )
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Compatibility Matches
              </h1>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  hasRun
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {hasRun
                  ? `${matches.length} Candidate ${matches.length === 1 ? 'Match' : 'Matches'}`
                  : 'Engine not run'}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Explore potential connections between available supply and
              buyer demand using location, quantity, quality, variety and
              delivery information.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 shrink-0">
            <CheckCircle2 className="h-4 w-4 text-green-700" />
            Deterministic matching
          </div>
        </div>

      </div>

      {/* Matching engine control panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <Play className="h-5 w-5 text-green-700" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  RiceLink Matching Engine
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Rule-based supply and demand evaluation
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 max-w-2xl">
              Run the engine to evaluate the available supply records against
              buyer demand and generate potential matches.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shrink-0 ${
              hasRun
                ? 'bg-green-50 text-green-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                hasRun ? 'bg-green-600' : 'bg-amber-500'
              }`}
            />
            {hasRun ? 'Evaluation completed' : 'Ready to run'}
          </span>
        </div>

        {/* Engine metrics */}
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-500 font-medium">
              Supply records
            </p>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">
              {SUPPLY_BATCHES.length}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              Available for evaluation
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-500 font-medium">
              Demand records
            </p>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">
              {DEMAND_TENDERS.length}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              Available for evaluation
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-500 font-medium">
              Candidate matches
            </p>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">
              {hasRun ? matches.length : '—'}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              {hasRun ? 'Results generated' : 'Awaiting evaluation'}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-500 font-medium">
              Matching method
            </p>
            <p className="mt-2 text-lg font-extrabold text-gray-900">
              Rule-based
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              No AI matching
            </p>
          </div>
        </div>

        {/* What the engine evaluates */}
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Evaluation criteria
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {[
              'Crop compatibility',
              'Location priority',
              'Quantity fulfilment',
              'Quality and variety',
              'Delivery timing',
            ].map((criterion) => (
              <div
                key={criterion}
                className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-700 shrink-0" />
                <span className="text-xs font-medium text-gray-700">
                  {criterion}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Run action */}
        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {lastRunAt ? (
              <>
                <p className="text-xs font-semibold text-gray-700">
                  Last evaluation
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {lastRunAt}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-500">
                No evaluation has been performed in this session.
              </p>
            )}
          </div>

          <Button
            onClick={runMatchingEngine}
            icon={
              hasRun
                ? <RotateCcw className="h-4 w-4" />
                : <Play className="h-4 w-4" />
            }
            className="w-full sm:w-auto"
          >
            {hasRun ? 'Run matching again' : 'Run matching engine'}
          </Button>
        </div>

        {hasRun && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 p-3">
            <CheckCircle2 className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-green-900">
              Evaluation completed. The engine generated {matches.length}{' '}
              candidate {matches.length === 1 ? 'match' : 'matches'} from the
              available sample records. Review the results below.
            </p>
          </div>
        )}
      </div>

      {/* Results before and after running */}
      {!hasRun ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Package className="h-7 w-7 text-gray-500" />
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-gray-900">
            Your matching results will appear here
          </h2>

          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Run the matching engine above to compare the available supply
            records with buyer demand and see the candidate opportunities it
            identifies.
          </p>
        </div>
      ) : matches.length === 0 || !selectedMatch ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Package className="h-7 w-7 text-gray-500" />
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-gray-900">
            No compatible matches found
          </h2>

          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            The engine did not find supply and demand records that meet its
            current eligibility requirements. You can add more suitable
            records or run the evaluation again when the data changes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Match list */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Candidate opportunities
              </h2>

              <span className="text-xs text-gray-400">
                Location-first priority
              </span>
            </div>

            {matches.map((match) => {
              const isSelected = selectedMatch.id === match.id
              const coverage = getAssessmentCoverage(
                match.breakdown.factors,
              )

              return (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all shadow-xs ${
                    isSelected
                      ? 'border-[#15803d] bg-[#f0fdf4] ring-2 ring-[#15803d]/15'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">
                        {match.supplyBatch.commodityName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {match.demandTender.organizationName}
                      </p>
                    </div>

                    {match.overallScore === null ? (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">
                        Score unavailable
                      </span>
                    ) : (
                      <MatchScorePill score={match.overallScore} />
                    )}
                  </div>

                  <div className="mt-3 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-gray-400" />
                      <span>
                        {formatNumber(match.breakdown.volumeFulfillableMT)} MT
                        potentially fulfilable
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span>{getLocationLabel(match)}</span>
                    </div>

                    {coverage && (
                      <div className="flex items-center gap-2">
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          {coverage.percentage}% assessment coverage
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200/70 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-gray-500">
                      {match.supplyBatch.location.state} to{' '}
                      {match.demandTender.deliveryLocation.state}
                    </span>

                    <span className="text-[11px] font-bold text-[#15803d]">
                      {isSelected ? 'Selected' : 'View details'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected match details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Match assessment
                  </p>

                  <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                    {selectedMatch.supplyBatch.commodityName}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {selectedMatch.demandTender.organizationName}
                  </p>
                </div>

                {selectedMatch.overallScore === null ? (
                  <span className="rounded-full bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
                    Score unavailable
                  </span>
                ) : (
                  <MatchScorePill score={selectedMatch.overallScore} />
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                    <Package className="h-4 w-4" />
                    Supply information
                  </div>

                  <p className="mt-3 text-sm font-extrabold text-gray-900">
                    {formatNumber(
                      selectedMatch.supplyBatch.metricTonnes ??
                        selectedMatch.breakdown.volumeFulfillableMT,
                    )}{' '}
                    MT
                    {selectedMatch.supplyBatch.metricTonnes === undefined && (
                      <span className="text-xs font-normal text-gray-500">
                        {' '}(fulfillable estimate)
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    {formatNumber(selectedMatch.supplyBatch.quantity)}{' '}
                    {selectedMatch.supplyBatch.unit}
                  </p>

                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
                    <p>
                      Variety:{' '}
                      {selectedMatch.supplyBatch.variety || 'Not specified'}
                    </p>

                    <p>
                      Grade:{' '}
                      {selectedMatch.supplyBatch.grade || 'Not specified'}
                    </p>

                    <p>
                      Moisture:{' '}
                      {typeof selectedMatch.supplyBatch.moistureContent === 'number'
                        ? `${selectedMatch.supplyBatch.moistureContent}%`
                        : 'Not recorded'}
                    </p>

                    <p>
                      Location:{' '}
                      {selectedMatch.supplyBatch.location.lga},{' '}
                      {selectedMatch.supplyBatch.location.state}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-800">
                    <Building2 className="h-4 w-4" />
                    Buyer requirements
                  </div>

                  <p className="mt-3 text-sm font-extrabold text-gray-900">
                    {formatNumber(
                      selectedMatch.demandTender.requiredQuantityMT,
                    )}{' '}
                    MT required
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    {selectedMatch.demandTender.organizationName}
                  </p>

                  <div className="mt-3 pt-3 border-t border-amber-200 space-y-1.5 text-xs text-gray-600">
                    <p>
                      Variety preference:{' '}
                      {selectedMatch.demandTender.varietyPreferences?.length
                        ? selectedMatch.demandTender.varietyPreferences.join(', ')
                        : 'Not specified'}
                    </p>

                    <p>
                      Maximum moisture:{' '}
                      {typeof selectedMatch.demandTender.acceptedMoistureMax === 'number'
                        ? `${selectedMatch.demandTender.acceptedMoistureMax}%`
                        : 'Not specified'}
                    </p>

                    <p>
                      Grade requirement:{' '}
                      {selectedMatch.demandTender.gradeRequirement || 'Not specified'}
                    </p>

                    <p>
                      Receiving location:{' '}
                      {selectedMatch.demandTender.deliveryLocation.lga},{' '}
                      {selectedMatch.demandTender.deliveryLocation.state}
                    </p>

                    {typeof selectedMatch.demandTender.targetPricePerMT === 'number' && (
                      <p>
                        Target price: ₦
                        {selectedMatch.demandTender.targetPricePerMT.toLocaleString('en-NG')}
                        {' '}/ MT
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Fulfilment overview */}
              <div className="mt-4 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-gray-700">
                    Potential quantity fulfilment
                  </p>

                  <p className="text-sm font-extrabold text-gray-900">
                    {selectedMatch.breakdown.volumePercentage}%
                  </p>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#15803d]"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(selectedMatch.breakdown.volumePercentage, 100),
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {formatNumber(selectedMatch.breakdown.volumeFulfillableMT)} MT
                  of {formatNumber(selectedMatch.demandTender.requiredQuantityMT)} MT
                  requested. This is a quantity comparison, not a confirmed allocation.
                </p>
              </div>

              {/* Location priority */}
              <div className="mt-4 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#15803d]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Location assessment
                  </h3>
                </div>

                <p className="mt-2 text-sm font-extrabold text-[#15803d]">
                  {getLocationLabel(selectedMatch)}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {selectedMatch.breakdown.factors?.location.explanation ??
                    'There is not enough location information to assess proximity.'}
                </p>

                <p className="mt-2 text-[11px] text-gray-400">
                  Location priority is based on available state and LGA
                  information. Road distance and travel time are not currently
                  calculated.
                </p>
              </div>
            </div>

            {/* Match factor breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Compatibility breakdown
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    See how each available factor contributes to the assessment.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600 shrink-0">
                  Rule-based
                </span>
              </div>

              {/* Assessment coverage */}
              {selectedCoverage && (
                <div className="mt-4 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Assessment coverage
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        How much of the matching criteria could be evaluated.
                      </p>
                    </div>

                    <span className="text-lg font-extrabold text-gray-900 shrink-0">
                      {selectedCoverage.percentage}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563eb] transition-all"
                      style={{
                        width: `${selectedCoverage.percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    {selectedCoverage.assessedWeight} of{' '}
                    {selectedCoverage.totalWeight} weighted points assessed.
                  </p>
                </div>
              )}

              {selectedMatch.breakdown.factors ? (
                <div className="mt-4 space-y-3">
                  {FACTOR_CONFIG.map(({ key, label }) => {
                    const factor = selectedMatch.breakdown.factors?.[key]

                    if (!factor) return null

                    return (
                      <MatchFactorCard
                        key={key}
                        label={label}
                        weight={factor.weight}
                        score={factor.score}
                        status={factor.status}
                        explanation={factor.explanation}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  Individual match factor information is not available for this record.
                </div>
              )}

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3">
                <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-blue-900">
                  The compatibility score uses factors with available
                  information. Assessment coverage shows how much of the
                  weighted criteria was evaluated. Unknown factors are
                  excluded rather than automatically treated as successful.
                  Neither figure guarantees a completed transaction.
                </p>
              </div>
            </div>

            {/* Timing and matching method */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>
                    Requested delivery:{' '}
                    {selectedMatch.demandTender.targetDeliveryDate}
                  </span>
                </div>

                <span className="text-xs font-semibold text-gray-500">
                  Method: {selectedMatch.matchingMethod === 'rule_based'
                    ? 'Deterministic rules'
                    : 'AI-assisted'}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Interested in this opportunity?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Start an enquiry to discuss terms and confirm details.
                  </p>
                </div>

                <Button
                  onClick={() => handleMessageBuyer(selectedMatch)}
                  icon={<MessageSquare className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  Start an enquiry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
