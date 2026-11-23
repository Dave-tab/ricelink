
import { Link, useLocation } from 'react-router-dom'
import { Sprout, Menu, X, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Home', href: '/#home', id: 'home' },
  { label: 'How It Works', href: '/#how-it-works', id: 'how-it-works' },
  { label: 'Participants', href: '/#participants', id: 'participants' },
  { label: 'Crops', href: '/#crops', id: 'crops' },
  { label: 'FAQs', href: '/#faq', id: 'faq' },
  { label: 'Contact', href: '/#contact', id: 'contact' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Scroll to the requested section after navigating back to the homepage.
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return

    const sectionId = location.hash.replace('#', '')

    const scrollToSection = () => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    requestAnimationFrame(scrollToSection)
  }, [location.pathname, location.hash])

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    setMenuOpen(false)

    if (location.pathname === '/') {
      event.preventDefault()

      window.history.pushState(null, '', `/#${sectionId}`)

      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/#home" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803d] text-white shadow-xs">
            <Sprout className="h-6 w-6" />
          </div>

          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#15803d]">
              RiceLink
            </span>
            <span className="ml-1.5 rounded-md bg-[#dcfce7] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#15803d]">
              Nigeria
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              onClick={(event) => handleSectionClick(event, link.id)}
              className={`text-sm font-bold transition-colors ${
                location.pathname === '/' &&
                location.hash === `#${link.id}`
                  ? 'text-[#15803d]'
                  : 'text-gray-600 hover:text-[#15803d]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#15803d] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#166534]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1.5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                onClick={(event) => handleSectionClick(event, link.id)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                  location.pathname === '/' &&
                  location.hash === `#${link.id}`
                    ? 'bg-[#f0fdf4] text-[#15803d]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-center text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#15803d] px-4 py-3 text-center text-sm font-bold text-white hover:bg-[#166534]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
