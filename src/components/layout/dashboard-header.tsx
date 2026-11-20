import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  Package,
  ShoppingCart,
  LogOut,
} from 'lucide-react'

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifications = [
    {
      id: 'n1',
      title: 'New Price Offer from Premier Rice',
      desc: '₦700,000 / MT offered for 42.5 MT Faro 44 Paddy Rice.',
      time: '12 mins ago',
      unread: true,
      link: '/inquiries',
    },
    {
      id: 'n2',
      title: 'High-Fit Match Found',
      desc: 'Crown Flour Mills posted a tender matching your Maize lot (91% fit).',
      time: '1 hour ago',
      unread: true,
      link: '/matches',
    },
    {
      id: 'n3',
      title: 'Warehouse Quality Verified',
      desc: 'Argungu Lot LOT-RIC-2026-089 lab moisture verified at 12.8%.',
      time: '3 hours ago',
      unread: false,
      link: '/supply',
    },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/commodities?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 lg:hidden cursor-pointer"
          onClick={onMenuToggle}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search crops, buyers, tenders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#f8faf7] pl-9 pr-3 py-2 text-xs font-medium focus:border-[#15803d] focus:bg-white focus:outline-none"
          />
        </form>
      </div>

      {/* Right Actions (Live indicator, Notifications, Profile) */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-bold">
          <span className="h-2 w-2 rounded-full bg-[#15803d] animate-pulse" />
          <span>Market Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="relative rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#d97706] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-1">
                <span className="text-xs font-extrabold text-gray-900">Notifications</span>
                <span className="text-[10px] font-bold text-[#15803d]">2 New</span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link}
                    onClick={() => setShowNotifications(false)}
                    className={`block p-2.5 rounded-xl transition-colors text-xs ${
                      n.unread ? 'bg-[#f0fdf4] text-gray-900 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{n.title}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-normal">{n.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative border-l border-gray-200 pl-3">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer p-1 rounded-xl hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dcfce7] text-[#15803d] font-extrabold text-sm shadow-xs">
              MA
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-extrabold text-gray-900 leading-tight">Musa Abdullahi</p>
              <p className="text-[11px] text-gray-500 font-semibold">Argungu Union</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">Musa Abdullahi</p>
                <p className="text-[11px] text-gray-500">Argungu Rice Farmers Co-op</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d]">
                  Verified Supplier
                </span>
              </div>

              <div className="pt-1.5 space-y-0.5 text-xs font-semibold">
                <Link
                  to="/supply"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  <Package className="h-4 w-4 text-[#15803d]" />
                  <span>My Produce Lots</span>
                </Link>

                <Link
                  to="/demand"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  <ShoppingCart className="h-4 w-4 text-[#d97706]" />
                  <span>Buyer Demands</span>
                </Link>

                <Link
                  to="/login"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border-t border-gray-100 mt-1 pt-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
