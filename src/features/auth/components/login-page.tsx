import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotNotice, setShowForgotNotice] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 600)
  }

  const handleQuickLogin = (role: 'farmer' | 'buyer') => {
    if (role === 'farmer') {
      setEmail('musa.abdullahi@argungufarmers.ng')
    } else {
      setEmail('procurement@premierrice.com.ng')
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 400)
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Sign In to RiceLink
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
          Enter your details to access your agricultural exchange console
        </p>
      </div>

      {showForgotNotice && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start justify-between">
          <span>Password reset link sent to your registered email or SMS.</span>
          <button
            onClick={() => setShowForgotNotice(false)}
            className="text-amber-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Email or Phone Number
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
            placeholder="080... or name@coop.ng"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700 uppercase">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotNotice(true)}
              className="text-xs text-[#15803d] font-bold hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
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
          {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
        </Button>
      </form>

      {/* 1-Click Demo Accounts for seamless inspection */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-[11px] font-bold text-gray-500 uppercase text-center mb-2.5">
          Or Quick Sign-In As:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('farmer')}
            className="p-2.5 rounded-xl border border-gray-200 bg-[#f0fdf4] hover:border-[#15803d] text-left transition-all cursor-pointer"
          >
            <span className="block text-xs font-bold text-[#15803d]">Farmer / Co-op</span>
            <span className="block text-[10px] text-gray-500">Musa Abdullahi</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('buyer')}
            className="p-2.5 rounded-xl border border-gray-200 bg-[#fef3c7]/60 hover:border-[#d97706] text-left transition-all cursor-pointer"
          >
            <span className="block text-xs font-bold text-[#b45309]">Industrial Buyer</span>
            <span className="block text-[10px] text-gray-500">Premier Rice Mills</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-600">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-[#15803d] hover:underline">
          Create Free Account
        </Link>
      </div>
    </div>
  )
}
