import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Layers,
  Package,
  ShoppingCart,
  GitCompare,
  MessageSquare,
} from 'lucide-react'

/**
 * Mobile-First Sticky Bottom Navigation Bar (Screen width < 768px)
 * Designed for quick one-handed operational triage in fields, collection centers, and depots.
 */
export function MobileNav() {
  const location = useLocation()

  const tabs = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Catalogue', href: '/commodities', icon: Layers },
    { label: 'Supply', href: '/supply', icon: Package },
    { label: 'Demand', href: '/demand', icon: ShoppingCart },
    { label: 'Matches', href: '/matches', icon: GitCompare, badge: 3 },
    { label: 'Desk', href: '/inquiries', icon: MessageSquare },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e5e7eb] bg-white/95 backdrop-blur-md pb-safe lg:hidden">
      <div className="grid grid-cols-6 h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-[#143d2b] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-[#143d2b]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
