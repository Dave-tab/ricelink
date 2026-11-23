
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, UserRound, ArrowUpRight } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const query = searchQuery.trim()

    if (!query) return

    navigate(`/commodities?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-md"
          >
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search crops and commodities..."
              aria-label="Search crops and commodities"
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10"
            />
          </form>
        </div>

        {/* Right section */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-3 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-xs font-medium text-gray-500">
              Preview workspace
            </span>
          </div>

          <Link
            to="/login"
            className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            <UserRound size={17} />
            <span className="hidden sm:inline">Account</span>
            <ArrowUpRight size={14} className="hidden sm:inline" />
          </Link>
        </div>
      </div>
    </header>
  )
}
