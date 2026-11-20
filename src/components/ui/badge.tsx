import { CheckCircle2, Clock, Truck, AlertCircle } from 'lucide-react'

export type StatusVariant = 'verified' | 'pending' | 'logistics' | 'inactive' | 'error'

interface StatusBadgeProps {
  status: StatusVariant | string
  label: string
  className?: string
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  let badgeClasses = 'bg-gray-100 text-gray-700 border-gray-200'
  let Icon = AlertCircle

  switch (status) {
    case 'verified':
    case 'approved':
    case 'active':
    case 'open':
      badgeClasses = 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
      Icon = CheckCircle2
      break
    case 'pending':
    case 'in_negotiation':
    case 'evaluating':
    case 'in_aggregation':
      badgeClasses = 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]'
      Icon = Clock
      break
    case 'logistics':
    case 'in_transit':
    case 'delivered':
      badgeClasses = 'bg-blue-50 text-blue-800 border-blue-200'
      Icon = Truck
      break
    case 'inactive':
    case 'closed':
    case 'draft':
      badgeClasses = 'bg-gray-100 text-gray-600 border-gray-200'
      Icon = Clock
      break
    case 'error':
      badgeClasses = 'bg-rose-50 text-rose-800 border-rose-200'
      Icon = AlertCircle
      break
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClasses} ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  )
}

interface CommodityMetricPillProps {
  volume: string | number
  unit: string
  spec?: string
  moisture?: number
  className?: string
}

export function CommodityMetricPill({
  volume,
  unit,
  spec,
  moisture,
  className = '',
}: CommodityMetricPillProps) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0fdf4] text-[#15803d] text-xs font-bold tabular-nums border border-[#bbf7d0] ${className}`}
    >
      <span className="text-gray-900 font-extrabold">
        {volume} {unit}
      </span>
      {spec && (
        <>
          <span className="text-gray-300">•</span>
          <span className="text-gray-700 font-semibold">{spec}</span>
        </>
      )}
      {moisture !== undefined && (
        <>
          <span className="text-gray-300">•</span>
          <span className="text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-md text-[11px] font-bold">
            {moisture}% Dryness
          </span>
        </>
      )}
    </div>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]">
      {category}
    </span>
  )
}

export function MatchScorePill({ score }: { score: number }) {
  const isHigh = score >= 90
  const isMed = score >= 75 && score < 90

  const colorClasses = isHigh
    ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
    : isMed
    ? 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]'
    : 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border tabular-nums ${colorClasses}`}
    >
      <span>{score}% Match</span>
    </span>
  )
}
