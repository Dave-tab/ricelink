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
  { label: 'Operational Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Commodity Catalogue', href: '/commodities', icon: Layers },
  { label: 'Supply Management', href: '/supply', icon: Package },
  { label: 'Demand & Tenders', href: '/demand', icon: ShoppingCart },
  { label: 'Compatibility Matches', href: '/matches', icon: GitCompare, badge: '3 Active' },
  { label: 'Coordination Desk', href: '/inquiries', icon: MessageSquare, badge: '1 New' },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const [activeOrg, setActiveOrg] = useState('Argungu Rice Farmers Co-op')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const organizations = [
    { name: 'Argungu Rice Farmers Co-op', role: 'Federated Aggregator', verified: true },
    { name: 'Premier Rice Processors Ltd', role: 'Industrial Off-taker', verified: true },
    { name: 'Personal Producer Account', role: 'Independent Grower', verified: false },
  ]

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#e5e7eb] bg-white transition-transform duration-200 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#e5e7eb] px-5 bg-white">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#143d2b] text-white">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-[#143d2b]">RiceLink</span>
            <span className="ml-2 rounded bg-[#c0edd2] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#002113]">
              Agri Hub
            </span>
          </div>
        </Link>
        <button
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Operating Context Switcher (Per DESIGN.md) */}
      <div className="border-b border-[#e5e7eb] bg-[#f8f9fa] p-3">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
          Active Operating Context
        </label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-2.5 text-left text-xs shadow-xs hover:border-[#143d2b] transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 shrink-0 text-[#143d2b]" />
              <div className="truncate">
                <p className="font-bold text-gray-900 truncate">{activeOrg}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Supply Participant</span>
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {organizations.map((org) => (
                <button
                  key={org.name}
                  onClick={() => {
                    setActiveOrg(org.name)
                    setDropdownOpen(false)
                  }}
                  className={`flex w-full flex-col px-3 py-2 text-left text-xs hover:bg-gray-50 ${
                    activeOrg === org.name ? 'bg-emerald-50 text-[#143d2b] font-bold' : 'text-gray-700'
                  }`}
                >
                  <span className="font-semibold">{org.name}</span>
                  <span className="text-[11px] text-gray-500">{org.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#143d2b] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-[#f1f3ff] hover:text-[#143d2b]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#c0edd2]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? 'bg-[#c0edd2] text-[#002113]' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Operational Footer Details */}
      <div className="border-t border-[#e5e7eb] p-3.5 bg-[#f8f9fa]">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-600">Active Node</span>
            <span className="font-bold text-[#143d2b]">Ibadan Cluster Hub</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-500">
            Multi-crop exchange routing online • 5 Supported Commodities
          </div>
        </div>
      </div>
    </aside>
  )
}
