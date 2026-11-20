import { Link, useLocation } from 'react-router-dom'
import {
  Sprout,
  LayoutDashboard,
  Layers,
  Package,
  ShoppingCart,
  GitCompare,
  MessageSquare,
  Building2,
  ChevronDown,
  X,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Sell Produce (Supply)', href: '/supply', icon: Package },
  { label: 'Buyer Requests (Demand)', href: '/demand', icon: ShoppingCart },
  { label: 'Find Matches', href: '/matches', icon: GitCompare, badge: '3 Matches' },
  { label: 'Messages & Deals', href: '/inquiries', icon: MessageSquare, badge: '1 New' },
  { label: 'Crops & Standards', href: '/commodities', icon: Layers },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const [activeOrg, setActiveOrg] = useState('Argungu Rice Farmers Co-op')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const organizations = [
    { name: 'Argungu Rice Farmers Co-op', role: 'Farmer Cooperative', verified: true },
    { name: 'Premier Rice Processors Ltd', role: 'Factory Buyer', verified: true },
    { name: 'Personal Account', role: 'Individual Farmer', verified: false },
  ]

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5 bg-white">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803d] text-white shadow-xs">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#15803d]">RiceLink</span>
            <span className="block text-[11px] font-semibold text-gray-500">Agri Exchange</span>
          </div>
        </Link>
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Simplified Operating Context */}
      <div className="border-b border-gray-100 bg-[#f8faf7] p-3.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
            You Are Acting As:
          </span>
          <span className="text-[10px] text-[#15803d] font-bold">Change ▾</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-2.5 text-left text-xs shadow-xs hover:border-[#15803d] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#dcfce7] text-[#15803d] shrink-0 font-bold">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="font-extrabold text-gray-900 truncate">{activeOrg}</p>
                <div className="flex items-center gap-1 text-[11px] text-[#15803d] font-semibold">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Member</span>
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
              {organizations.map((org) => (
                <button
                  key={org.name}
                  onClick={() => {
                    setActiveOrg(org.name)
                    setDropdownOpen(false)
                  }}
                  className={`flex w-full flex-col px-3 py-2 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                    activeOrg === org.name
                      ? 'bg-[#dcfce7] text-[#15803d] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold">{org.name}</span>
                  <span className="text-[11px] text-gray-500">{org.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#15803d] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-[#f0fdf4] hover:text-[#15803d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                    isActive ? 'bg-white text-[#15803d]' : 'bg-[#fef3c7] text-[#b45309]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Help Notice */}
      <div className="border-t border-gray-100 p-3.5 bg-[#f8faf7]">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs text-xs">
          <p className="font-bold text-gray-900">Need Help Buying or Selling?</p>
          <p className="mt-0.5 text-gray-500 text-[11px]">
            Call our agricultural support desk anytime.
          </p>
          <p className="mt-2 font-bold text-[#15803d] text-[11px]">📞 0800-RICE-LINK</p>
        </div>
      </div>
    </aside>
  )
}
