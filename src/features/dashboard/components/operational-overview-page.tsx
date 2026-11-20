import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingCart,
  GitCompare,
  ArrowRight,
  MapPin,
  Plus,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react'
import { StatusBadge, MatchScorePill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SUPPLY_BATCHES, COMPATIBILITY_MATCHES } from '@/data/mock-data'

export function OperationalOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Friendly Welcome & Primary Actions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, Musa
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Trading with <strong className="text-gray-900">Argungu Rice Farmers Cooperative Union</strong> in Kebbi State.
            </p>
          </div>

          {/* Big, obvious call-to-actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <Link to="/supply?action=new">
              <Button
                size="md"
                fullWidth
                icon={<Plus className="h-5 w-5" />}
                className="bg-[#15803d] hover:bg-[#166534]"
              >
                + Sell Produce (List Crop)
              </Button>
            </Link>
            <Link to="/demand">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                icon={<ShoppingCart className="h-4 w-4 text-[#d97706]" />}
              >
                View Buyer Requests
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick summary stats in plain language */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100">
          <Link
            to="/supply"
            className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] hover:border-[#15803d] transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-600 font-semibold">Your Produce for Sale</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#15803d] tabular-nums mt-0.5">
                4 Harvest Lots
              </p>
              <p className="text-[11px] text-gray-500 font-medium">227.5 Metric Tonnes ready →</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#15803d]">
              <Package className="h-5 w-5" />
            </div>
          </Link>

          <Link
            to="/demand"
            className="p-3.5 rounded-xl bg-[#fef3c7]/60 border border-[#fde68a] hover:border-[#d97706] transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-600 font-semibold">Buyer Requests Looking</p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#b45309] tabular-nums mt-0.5">
                3 Open Tenders
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Factories looking for crops →</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#fef3c7] flex items-center justify-center text-[#b45309]">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </Link>

          <Link
            to="/matches"
            className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-400 transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-600 font-semibold">Matches for Your Crops</p>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-800 tabular-nums mt-0.5">
                3 Direct Buyers
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Ready for immediate deals →</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <GitCompare className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recommended Matches for You */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Buyers Interested in Your Produce
            </h2>
            <p className="text-xs text-gray-500">
              Our system found verified buyers looking for the exact crops you have stored.
            </p>
          </div>
          <Link
            to="/matches"
            className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1"
          >
            <span>See All ({COMPATIBILITY_MATCHES.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPATIBILITY_MATCHES.map((match) => (
            <div
              key={match.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-[#f8faf7] p-4 hover:border-[#15803d] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-[#15803d] text-xs">
                    {match.supplyBatch.commodityName}
                  </span>
                  <MatchScorePill score={match.overallScore} />
                </div>

                <h3 className="font-extrabold text-gray-900 text-sm">
                  {match.demandTender.organizationName}
                </h3>

                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-500">Buyer Wants: </span>
                    <strong className="text-gray-900">{match.demandTender.requiredQuantityMT} Tonnes</strong>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-500">You Can Supply: </span>
                    <strong className="text-[#15803d]">{match.breakdown.volumeFulfillableMT} Tonnes</strong>
                  </p>
                  <div className="flex items-center gap-1.5 text-gray-500 pt-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>Delivered to {match.demandTender.deliveryLocation.state} State</span>
                  </div>
                </div>

                <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#15803d] shrink-0" />
                  <span>Dryness is good ({match.supplyBatch.moistureContent}% MC)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <Link
                  to={`/inquiries?match=${match.id}&buyer=${encodeURIComponent(
                    match.demandTender.organizationName
                  )}&crop=${encodeURIComponent(match.supplyBatch.commodityName)}`}
                >
                  <Button fullWidth size="sm" icon={<MessageSquare className="h-4 w-4" />}>
                    Message Buyer
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Produce for Sale */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Your Listed Produce
            </h2>
            <p className="text-xs text-gray-500">
              Crops currently visible to all buyers and food processors across Nigeria.
            </p>
          </div>
          <Link to="/supply" className="text-xs font-bold text-[#15803d] hover:underline">
            Manage All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SUPPLY_BATCHES.map((batch) => (
            <div
              key={batch.id}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#15803d] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-gray-900 text-sm">{batch.commodityName}</span>
                  <StatusBadge status="verified" label="Active" />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  <span className="font-extrabold text-gray-900 tabular-nums">
                    {batch.quantity} {batch.unit}
                  </span>
                  <span className="text-gray-400">({batch.metricTonnes} Tonnes)</span>
                  <span>•</span>
                  <span>{batch.location.state} State</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Stored at: {batch.location.facilityName}
                </p>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400">Asking Price</span>
                <p className="text-sm font-extrabold text-[#15803d] tabular-nums">
                  ₦{(batch.askingPricePerMT || 0).toLocaleString()} / Tonne
                </p>
                <Link
                  to="/supply"
                  className="text-[11px] font-bold text-[#15803d] hover:underline mt-1 inline-block"
                >
                  Edit or View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
