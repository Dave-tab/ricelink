
import { Link, useLocation } from 'react-router-dom'
import {
  Sprout,
  LayoutDashboard,
  Layers,
  Package,
  ShoppingCart,
  MessageSquare,
  Building2,
  UserRound,
  X,
  Compass,
  GitCompareArrows,
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Marketplace', href: '/commodities', icon: Layers },
  { label: 'My Supply', href: '/supply', icon: Package },
  { label: 'My Demand', href: '/demand', icon: ShoppingCart },
  {
    label: 'Compatibility Matches',
    href: '/matches',
    icon: GitCompareArrows,
  },
  { label: 'Messages', href: '/inquiries', icon: MessageSquare },
]

const upcomingItems = [
  { label: 'Organisations', icon: Building2 },
  { label: 'Profile', icon: UserRound },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }

    return location.pathname.startsWith(href)
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-5">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803d] text-white shadow-sm">
            <Sprout className="h-6 w-6" />
          </div>

          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#15803d]">
              RiceLink
            </span>
            <span className="block text-[11px] font-medium text-gray-500">
              Agricultural Coordination
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Workspace context */}
      <div className="border-b border-gray-100 bg-[#f8faf7] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Compass className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">
              Your workspace
            </p>
            <p className="mt-0.5 text-xs leading-5 text-gray-500">
              Manage your agricultural activities in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto p-3"
      >
        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
          Workspace
        </p>

        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                active
                  ? 'bg-[#15803d] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-green-50 hover:text-[#15803d]'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  active ? 'text-white' : 'text-gray-400'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="mb-3 mt-7 px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
          Account
        </div>

        {upcomingItems.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              aria-disabled="true"
              title={`${item.label} page is not available yet`}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-gray-400"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-400">
                Soon
              </span>
            </div>
          )
        })}
      </nav>

      {/* Help section */}
      <div className="shrink-0 border-t border-gray-100 bg-[#f8faf7] p-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <MessageSquare className="h-4 w-4" />
            </div>
            <p className="text-xs font-bold text-gray-900">
              Need assistance?
            </p>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-gray-500">
            RiceLink support information will be available here.
          </p>
        </div>
      </div>
    </aside>
  )
}
