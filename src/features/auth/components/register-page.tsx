import { Link } from 'react-router-dom'
import { useState } from 'react'

const ROLES = [
  { id: 'producer', label: 'Producer / Farmer', desc: 'Grow and supply agricultural commodities' },
  { id: 'aggregator', label: 'Aggregator', desc: 'Source and consolidate produce from multiple producers' },
  { id: 'processor', label: 'Processor / Miller', desc: 'Transform raw crops into finished goods' },
  { id: 'buyer', label: 'Buyer / Off-taker', desc: 'Purchase produce for commercial or institutional use' },
  { id: 'logistics', label: 'Logistics Provider', desc: 'Transportation and delivery services' },
  { id: 'storage', label: 'Storage Operator', desc: 'Warehousing and cold-storage facilities' },
]

export function RegisterPage() {
  const [role, setRole] = useState('producer')
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('individual')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Phase 3 will connect to Supabase Auth
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 text-center">Join RiceLink</h2>
      <p className="mt-1 text-sm text-gray-600 text-center">
        Create an account for multi-crop coordination
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAccountType('individual')}
              className={`rounded-lg border py-2 text-xs font-semibold ${
                accountType === 'individual'
                  ? 'border-primary-600 bg-primary-50 text-primary-800'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Individual Participant
            </button>
            <button
              type="button"
              onClick={() => setAccountType('organization')}
              className={`rounded-lg border py-2 text-xs font-semibold ${
                accountType === 'organization'
                  ? 'border-primary-600 bg-primary-50 text-primary-800'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Organization / Enterprise
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Adebayo Ogunlesi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="you@domain.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          Create Account
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </div>
    </div>
  )
}
