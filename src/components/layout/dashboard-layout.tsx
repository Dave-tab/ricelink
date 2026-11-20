import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { DashboardHeader } from './dashboard-header'
import { MobileNav } from './mobile-nav'
import { useState } from 'react'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-[#f9f9ff]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content Canvas */}
      <div className="flex flex-1 flex-col lg:pl-72 pb-16 lg:pb-0 min-w-0">
        <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <MobileNav />
    </div>
  )
}
