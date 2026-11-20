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
      badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200'
      Icon = CheckCircle2
      break
    case 'pending':
    case 'in_negotiation':
    case 'evaluating':
    case 'in_aggregation':
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200'
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
      badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200'
      Icon = Clock
      break
    case 'error':
      badgeClasses = 'bg-rose-50 text-rose-800 border-rose-200'
      Icon = AlertCircle
      break
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClasses} ${className}`}
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f3f4f1] text-[#143d2b] text-xs font-semibold tabular-nums border border-[#e5e7eb] ${className}`}
    >
      <span className="font-bold">
        {volume} {unit}
      </span>
      {spec && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-700">{spec}</span>
        </>
      )}
      {moisture !== undefined && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded text-[11px]">
            {moisture}% MC
          </span>
        </>
      )}
    </div>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#e9edff] text-[#00195d]">
      {category}
    </span>
  )
}

export function MatchScorePill({ score }: { score: number }) {
  const isHigh = score >= 90
  const isMed = score >= 75 && score < 90

  const colorClasses = isHigh
    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
    : isMed
    ? 'bg-amber-100 text-amber-900 border-amber-300'
    : 'bg-slate-100 text-slate-800 border-slate-300'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border tabular-nums ${colorClasses}`}
    >
      <span>{score}% Match</span>
    </span>
  )
}
