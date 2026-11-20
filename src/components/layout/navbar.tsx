import { Link, useLocation } from 'react-router-dom'
import { Sprout, Menu, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Commodity Catalogue', href: '/commodities' },
    { label: 'Supply Batches', href: '/supply' },
    { label: 'Buyer Tenders', href: '/demand' },
    { label: 'Compatibility Matches', href: '/matches' },
    { label: 'Coordination Desk', href: '/inquiries' },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
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

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-xs font-bold transition-colors ${
                location.pathname === link.href
                  ? 'text-[#143d2b] border-b-2 border-[#143d2b] pb-0.5'
                  : 'text-gray-600 hover:text-[#143d2b]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#143d2b] px-4 py-2 text-xs font-bold text-white hover:bg-[#002717] transition-all"
          >
            <span>Launch Platform</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="border-t border-[#e5e7eb] bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#143d2b] bg-[#f0fdf4]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-[#143d2b] px-3 py-2.5 text-center text-xs font-bold text-white hover:bg-[#002717]"
            >
              Enter Operational Platform
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
