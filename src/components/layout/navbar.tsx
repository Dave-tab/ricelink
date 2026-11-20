import { Link, useLocation } from 'react-router-dom'
import { Sprout, Menu, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Sell Produce', href: '/supply' },
    { label: 'Buyer Requests', href: '/demand' },
    { label: 'Find Matches', href: '/matches' },
    { label: 'Messages', href: '/inquiries' },
    { label: 'Crops Guide', href: '/commodities' },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803d] text-white shadow-xs">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#15803d]">RiceLink</span>
            <span className="ml-1.5 rounded-md bg-[#dcfce7] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#15803d]">
              Nigeria
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-bold transition-colors ${
                location.pathname === link.href
                  ? 'text-[#15803d] border-b-2 border-[#15803d] pb-0.5'
                  : 'text-gray-600 hover:text-[#15803d]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#15803d] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#166534] transition-all shadow-xs"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1.5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#15803d] bg-[#f0fdf4]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#15803d] px-4 py-3 text-center text-sm font-bold text-white hover:bg-[#166534]"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
