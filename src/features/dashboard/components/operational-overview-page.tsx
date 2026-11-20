import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingCart,
  GitCompare,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Plus,
} from 'lucide-react'
import { StatusBadge, CommodityMetricPill, MatchScorePill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SUPPLY_BATCHES, COMPATIBILITY_MATCHES, INQUIRY_THREADS } from '@/data/mock-data'

export function OperationalOverviewPage() {
  const kpis = [
    {
      label: 'Verified Supply Active',
      value: '227.5',
      unit: 'MT',
      subtext: '4 Multi-crop lots',
      trend: '+18.5 MT this week',
      icon: Package,
    },
    {
      label: 'Open Buyer Tenders',
      value: '470.0',
      unit: 'MT',
      subtext: '3 Commercial off-takers',
      trend: '₦324M total pipeline',
      icon: ShoppingCart,
    },
    {
      label: 'Algorithmic Matches',
      value: '3',
      unit: 'Active',
      subtext: 'Average 94% fit',
      trend: 'High proximity alignment',
      icon: GitCompare,
    },
    {
      label: 'Coordination Threads',
      value: '2',
      unit: 'Open',
      subtext: '1 Term Proposal pending',
      trend: 'Avg response < 45m',
      icon: MessageSquare,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#143d2b]">
              Operational Coordination Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Matching Engine
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Real-time supply consolidation, buyer tender discovery, and deterministic routing across regional clusters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/supply">
            <Button size="sm" icon={<Plus className="h-4 w-4" />}>
              Allocate Harvest Batch
            </Button>
          </Link>
          <Link to="/demand">
            <Button variant="secondary" size="sm">
              View Tenders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="p-4 sm:p-5 rounded-xl bg-white border border-[#e5e7eb] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
                  {kpi.label}
                </span>
                <div className="p-2 rounded-lg bg-[#e9edff] text-[#00195d]">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tabular-nums">
                    {kpi.value}
                  </span>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    {kpi.unit}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 font-medium">{kpi.subtext}</p>
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <TrendingUp className="h-3 w-3" />
                  <span>{kpi.trend}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* High-Priority Compatibility Opportunities (Section matching Stitch) */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              High-Priority Compatibility Opportunities
            </h2>
          </div>
          <Link
            to="/matches"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#143d2b] hover:underline"
          >
            <span>View All Matches</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPATIBILITY_MATCHES.map((match) => (
            <div
              key={match.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-[#f8f9fa] hover:border-[#143d2b] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {match.supplyBatch.commodityName}
                  </span>
                  <MatchScorePill score={match.overallScore} />
                </div>

                <h3 className="font-bold text-gray-900 text-sm">
                  {match.demandTender.organizationName}
                </h3>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <CommodityMetricPill
                    volume={match.breakdown.volumeFulfillableMT}
                    unit="MT"
                    spec={match.supplyBatch.grade}
                    moisture={match.supplyBatch.moistureContent}
                  />
                </div>

                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">
                      {match.supplyBatch.location.state} → {match.demandTender.deliveryLocation.state} (
                      {match.breakdown.distanceKm} km corridor)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium">
                  {match.breakdown.volumePercentage.toFixed(0)}% tender volume
                </span>
                <Link to="/inquiries">
                  <Button size="sm" variant="outline" className="text-xs">
                    Initiate Desk Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Grid: Active Supply Batches & Coordination Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Supply Batches */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Active Supply Allocations
            </h2>
            <Link to="/supply" className="text-xs font-bold text-[#143d2b] hover:underline">
              Manage Batches
            </Link>
          </div>

          <div className="space-y-3">
            {SUPPLY_BATCHES.map((batch) => (
              <div
                key={batch.id}
                className="p-3.5 rounded-xl border border-gray-200 bg-[#f9f9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{batch.commodityName}</span>
                    <StatusBadge status={batch.status} label={batch.status.toUpperCase()} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-gray-600">
                    <span className="font-bold text-gray-900 tabular-nums">
                      {batch.quantity} {batch.unit}
                    </span>
                    <span>({batch.metricTonnes} MT)</span>
                    <span>•</span>
                    <span>{batch.location.facilityName}, {batch.location.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#143d2b] tabular-nums">
                    ₦{(batch.askingPricePerMT || 0).toLocaleString()} / MT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries & Coordination Desk */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Coordination Desk Activity
            </h2>
            <Link to="/inquiries" className="text-xs font-bold text-[#143d2b] hover:underline">
              Open Desk ({INQUIRY_THREADS.length})
            </Link>
          </div>

          <div className="space-y-3">
            {INQUIRY_THREADS.map((thread) => (
              <Link
                key={thread.id}
                to="/inquiries"
                className="block p-3.5 rounded-xl border border-gray-200 bg-[#f9f9ff] hover:border-[#143d2b] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">
                      {thread.counterpartyOrg}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span className="h-2 w-2 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {thread.lastActivity}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-medium text-gray-800">{thread.commoditySummary}</span>
                  <span>•</span>
                  <span>{thread.quantitySummary}</span>
                </div>

                <div className="mt-2 text-xs text-gray-500 line-clamp-1 italic">
                  "{thread.messages[thread.messages.length - 1].message}"
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
