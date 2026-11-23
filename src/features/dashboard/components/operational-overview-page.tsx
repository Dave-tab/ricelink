import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock3,
  Compass,
  MessageSquare,
  Package,
  MapPin,
  Search,
  ShieldAlert,
  ShoppingCart,
  Sprout,
  Truck,
} from 'lucide-react'
import {
  SUPPLY_BATCHES,
  DEMAND_TENDERS,
  COMPATIBILITY_MATCHES,
  INQUIRY_THREADS,
} from '@/data/mock-data'

const openDemands = DEMAND_TENDERS.filter(
  (tender) => tender.status === 'open',
)

function formatMilestone(value: string) {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function OperationalOverviewPage() {
  const recentThreads = INQUIRY_THREADS.slice(0, 3)
  const sampleSupply = SUPPLY_BATCHES.slice(0, 3)
  const sampleDemands = openDemands.slice(0, 3)
  const sampleMatches = COMPATIBILITY_MATCHES.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative p-5 sm:p-7">
          <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-green-50" />
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full border-[18px] border-green-50/70" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
                <Sprout className="h-4 w-4" />
                RiceLink workspace
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Welcome to your dashboard.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                Discover agricultural opportunities, coordinate supply and
                demand, and stay connected with people across the value chain.
              </p>
            </div>

            <div className="relative flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
              <Link
                to="/supply?action=new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803d] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#166534]"
              >
                <Package className="h-4 w-4" />
                Publish supply
              </Link>

              <Link
                to="/demand"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:bg-green-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Post a demand
              </Link>
            </div>
          </div>

          <div className="relative mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Account verification
                </p>
                <p className="mt-0.5 max-w-xl text-xs leading-5 text-gray-500">
                  Verification information will appear here when account
                  verification is connected. This preview does not assume
                  that an account has been verified.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              Not connected
            </span>
          </div>
        </div>
      </section>


      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
            What would you like to do?
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Get to the part of RiceLink you need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/supply?action=new"
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
          >
            <div className="rounded-xl bg-green-50 p-3 text-green-700 transition group-hover:bg-green-100">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">
                Publish supply
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                List available produce
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700" />
          </Link>

          <Link
            to="/commodities"
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
          >
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 transition group-hover:bg-blue-100">
              <Search className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">
                Find produce
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Browse the crop catalogue
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700" />
          </Link>

          <Link
            to="/demand"
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
          >
            <div className="rounded-xl bg-amber-50 p-3 text-amber-700 transition group-hover:bg-amber-100">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">
                Post a demand
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Share what you need
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700" />
          </Link>

          <Link
            to="/matches"
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
          >
            <div className="rounded-xl bg-purple-50 p-3 text-purple-700 transition group-hover:bg-purple-100">
              <Compass className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">
                Explore opportunities
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Review compatibility matches
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700" />
          </Link>
        </div>
      </section>

      {/* Activity overview */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
            My activities
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A summary of the sample records currently available in this preview.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            to="/supply"
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-green-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Supply records
              </span>
              <span className="rounded-lg bg-green-50 p-2.5 text-green-700">
                <Package className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-gray-900">
              {SUPPLY_BATCHES.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Sample produce listings
            </p>
          </Link>

          <Link
            to="/demand"
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Open demands
              </span>
              <span className="rounded-lg bg-amber-50 p-2.5 text-amber-700">
                <ShoppingCart className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-gray-900">
              {openDemands.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Sample buyer requirements
            </p>
          </Link>

          <Link
            to="/inquiries"
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Conversations
              </span>
              <span className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
                <MessageSquare className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-gray-900">
              {INQUIRY_THREADS.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Sample enquiry threads
            </p>
          </Link>
        </div>
      </section>

      {/* Discover opportunities */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
              Discover opportunities
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Explore sample supply and demand records across the platform.
            </p>
          </div>
          <Link
            to="/matches"
            className="inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:text-green-800"
          >
            View opportunities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Buyer demand */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-gray-900">
                    Buyer requirements
                  </h3>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Sample demand from buyers and processors.
                </p>
              </div>
              <Link
                to="/demand"
                className="text-xs font-bold text-green-700 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {sampleDemands.map((demand) => (
                <div
                  key={demand.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {demand.commodityName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {demand.organizationName}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                      Open demand
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-gray-400" />
                      {demand.requiredQuantityMT.toLocaleString()} MT
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {demand.deliveryLocation.state}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                      {demand.targetDeliveryDate}
                    </span>
                  </div>
                </div>
              ))}

              {sampleDemands.length === 0 && (
                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  No sample buyer requirements are available yet.
                </p>
              )}
            </div>
          </div>

          {/* Available supply */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-green-50 p-2 text-green-700">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-gray-900">
                    Available supply
                  </h3>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Sample produce records from suppliers and aggregators.
                </p>
              </div>
              <Link
                to="/supply"
                className="text-xs font-bold text-green-700 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {sampleSupply.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {batch.commodityName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {batch.organizationName}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200">
                      {batch.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-gray-400" />
                      {batch.quantity.toLocaleString()} {batch.unit}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {batch.location.state}
                    </span>
                  </div>
                </div>
              ))}

              {sampleSupply.length === 0 && (
                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  No sample supply records are available yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Compatibility examples */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">
                Compatibility examples
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Illustrative supply-and-demand pairings from the sample dataset.
              </p>
            </div>
            <Link
              to="/matches"
              className="text-xs font-bold text-green-700 hover:underline"
            >
              View matches
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {sampleMatches.map((match) => (
              <div
                key={match.id}
                className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-green-800">
                    {match.supplyBatch.commodityName}
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-gray-600 ring-1 ring-gray-200">
                    Sample score: {match.overallScore}%
                  </span>
                </div>

                <p className="mt-3 text-sm font-bold text-gray-900">
                  {match.demandTender.organizationName}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {match.breakdown.volumeFulfillableMT.toLocaleString()} MT
                  from the sample supply record can contribute towards a
                  {` ${match.demandTender.requiredQuantityMT.toLocaleString()} MT `}
                  requirement.
                </p>

                <Link
                  to="/matches"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:underline"
                >
                  Review example
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}

            {sampleMatches.length === 0 && (
              <p className="text-sm text-gray-500">
                No compatibility examples are available yet.
              </p>
            )}
          </div>
        </div>

        {/* Service providers */}
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-5 sm:flex-row sm:items-center">
          <div className="w-fit rounded-xl bg-white p-3 text-gray-500 ring-1 ring-gray-200">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Service providers
            </h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Logistics, storage and other service-provider discovery can
              appear here when those records are available in the platform
              dataset.
            </p>
          </div>
        </div>
      </section>

      {/* Recent conversations */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
              Recent conversations
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sample enquiries and coordination activity.
            </p>
          </div>

          <Link
            to="/inquiries"
            className="inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:underline"
          >
            Open messages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {recentThreads.map((thread) => {
            const latestMessage =
              thread.messages[thread.messages.length - 1]

            return (
              <Link
                key={thread.id}
                to="/inquiries"
                className="flex flex-col gap-3 py-4 transition hover:bg-gray-50/70 sm:flex-row sm:items-center"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  {thread.counterpartyOrg ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <MessageSquare className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">
                      {thread.counterpartyOrg}
                    </p>
                    {thread.unreadCount > 0 && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                        {thread.unreadCount} unread
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {thread.commoditySummary} · {thread.quantitySummary}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-gray-600">
                    {latestMessage?.message ?? 'No message preview available.'}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-gray-400 sm:flex-col sm:items-end">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{thread.lastActivity}</span>
                  <span className="hidden rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 sm:inline-block">
                    {formatMilestone(thread.currentMilestone)}
                  </span>
                </div>
              </Link>
            )
          })}

          {recentThreads.length === 0 && (
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm font-semibold text-gray-700">
                No conversations yet
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Enquiries and conversations will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}