import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  GitCompare,
  MessageSquare,
  Layers,
} from 'lucide-react'

export function MobileNav() {
  const location = useLocation()

  const tabs = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Sell', href: '/supply', icon: Package },
    { label: 'Buy', href: '/demand', icon: ShoppingCart },
    { label: 'Matches', href: '/matches', icon: GitCompare, badge: 3 },
    { label: 'Messages', href: '/inquiries', icon: MessageSquare, badge: 1 },
    { label: 'Crops', href: '/commodities', icon: Layers },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md pb-safe lg:hidden shadow-lg">
      <div className="grid grid-cols-6 h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-[#15803d] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d97706] text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-6 rounded-full bg-[#15803d]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
