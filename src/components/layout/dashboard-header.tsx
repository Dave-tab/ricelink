import { Menu, Bell, Search } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white/90 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
          onClick={onMenuToggle}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 bg-[#f8f9fa] px-3 py-1.5 text-xs text-gray-500 w-72">
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <span>Search batches, crops, tenders, locations...</span>
        </div>
      </div>

      {/* Right Actions & Status */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f3ff] text-[#00195d] text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Exchange Feed</span>
        </div>

        <button
          className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c0edd2] text-[#002717] font-bold text-sm">
            MA
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-bold text-gray-900">Musa Abdullahi</p>
            <p className="text-[11px] text-gray-500">Argungu Union Lead</p>
          </div>
        </div>
      </div>
    </header>
  )
}
