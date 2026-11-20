import { Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const stats = [
    { label: 'Active Supply Listings', value: '0', icon: Package, href: '/supply' },
    { label: 'Active Procurement Demands', value: '0', icon: ShoppingCart, href: '/demand' },
    { label: 'Potential Matches', value: '0', icon: TrendingUp, href: '/matches' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to RiceLink Multi-Crop Coordination Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="p-5 rounded-xl bg-white border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{s.label}</span>
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{s.value}</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/supply/new"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            + Create Supply Listing
          </Link>
          <Link
            to="/demand/new"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            + Create Demand Request
          </Link>
        </div>
      </div>
    </div>
  )
}
