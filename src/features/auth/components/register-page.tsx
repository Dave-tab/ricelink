import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const ROLES = [
  { id: 'producer', label: 'Farmer / Producer', desc: 'Grow & harvest crops' },
  { id: 'aggregator', label: 'Aggregator / Co-op', desc: 'Consolidate produce from farms' },
  { id: 'processor', label: 'Processor / Miller', desc: 'Transform crops into food products' },
  { id: 'buyer', label: 'Commercial Buyer', desc: 'Purchase raw materials at scale' },
]

export function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('producer')
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('organization')
  const [fullName, setFullName] = useState('Musa Abdullahi')
  const [orgName, setOrgName] = useState('Argungu Rice Farmers Cooperative Union')
  const [email, setEmail] = useState('musa.abdullahi@argungufarmers.ng')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Join RiceLink
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          Create your account for multi-crop trading and coordination across Nigeria
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
            Are You Registering As:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAccountType('individual')}
              className={`rounded-xl border py-2.5 px-3 text-xs font-bold transition-all cursor-pointer ${
                accountType === 'individual'
                  ? 'border-[#15803d] bg-[#dcfce7] text-[#15803d]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Individual Person
            </button>
            <button
              type="button"
              onClick={() => setAccountType('organization')}
              className={`rounded-xl border py-2.5 px-3 text-xs font-bold transition-all cursor-pointer ${
                accountType === 'organization'
                  ? 'border-[#15803d] bg-[#dcfce7] text-[#15803d]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cooperative / Company
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Your Primary Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  role === r.id
                    ? 'border-[#15803d] bg-[#dcfce7] text-[#15803d]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {accountType === 'organization' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Cooperative or Business Name
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
              placeholder="e.g. Argungu Farmers Union"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Your Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
            placeholder="e.g. Musa Abdullahi"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Email or Phone Number
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
            placeholder="080... or email@domain.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Create Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={isLoading}
          icon={!isLoading ? <ArrowRight className="h-5 w-5" /> : undefined}
          className="bg-[#15803d] hover:bg-[#166534]"
        >
          {isLoading ? 'Creating Account...' : 'Complete Registration'}
        </Button>
      </form>

      <div className="mt-5 text-center text-xs text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#15803d] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}
