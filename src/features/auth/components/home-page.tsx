import { Link } from 'react-router-dom'
import {
  Sprout,
  ArrowRight,
  Layers,
  Package,
  ShoppingCart,
  GitCompare,
  MessageSquare,
  ShieldCheck,
  Scale,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HomePage() {
  const screens = [
    {
      title: 'Operational Dashboard Overview',
      desc: 'Real-time multi-crop visibility, active operating context switching, and pipeline metrics for field aggregators and industrial processors.',
      href: '/dashboard',
      icon: TrendingUp,
      badge: 'Core Console',
    },
    {
      title: 'Universal Commodity Catalogue',
      desc: 'Configurable agricultural directory covering grains, legumes, tubers, and cash crops with certified moisture thresholds and grade definitions.',
      href: '/commodities',
      icon: Layers,
      badge: 'Multi-Crop Schema',
    },
    {
      title: 'Supply Management & Harvest Batches',
      desc: 'Harvest lot allocation with real-time bag-to-MT auto-conversions, lab moisture tracking, and depot warehouse manifests.',
      href: '/supply',
      icon: Package,
      badge: 'Aggregator Desk',
    },
    {
      title: 'Procurement Demand & Buyer Tenders',
      desc: 'Forward sourcing tenders published by commercial flour mills, rice parboilers, starch extractors, and feed manufacturers.',
      href: '/demand',
      icon: ShoppingCart,
      badge: 'Off-taker Portal',
    },
    {
      title: 'Algorithmic Compatibility Matches',
      desc: 'Deterministic multi-factor evaluation engine pairing physical harvest lots with buyer tenders by crop, quality, moisture, transit distance, and volume.',
      href: '/matches',
      icon: GitCompare,
      badge: 'Rule Engine',
    },
    {
      title: 'Inquiries & Bilateral Coordination Desk',
      desc: 'Traceable communication channel with step-by-step negotiation milestones, formal term proposals, and verifiable dispatch records.',
      href: '/inquiries',
      icon: MessageSquare,
      badge: 'Deal Pipeline',
    },
  ]

  return (
    <div className="bg-[#f9f9ff]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c0edd2] text-[#002113] text-xs font-bold mb-6">
            <Sprout className="h-4 w-4 text-[#002717]" />
            <span>Multi-Crop Agricultural Supply-Chain Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.15]">
            Bridging farmgate harvest supply to{' '}
            <span className="text-[#143d2b]">industrial processing & food markets</span>
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            RiceLink coordinates agricultural aggregation across Nigeria and regional supply corridors.
            A shared, configurable catalogue for <strong>paddy rice, yellow maize, sorghum, cassava tubers, soybeans, and cash crops</strong>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" fullWidth icon={<ArrowRight className="h-5 w-5" />}>
                Launch Operational Platform
              </Button>
            </Link>
            <Link to="/commodities" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth icon={<Layers className="h-5 w-5" />}>
                Explore Commodity Catalogue
              </Button>
            </Link>
          </div>

          {/* Value props strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-100 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Multi-Crop Schema</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">No crop hardcoding; dynamic attributes & varieties.</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Scale className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Explicit Units</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">Strict 50kg, 100kg & MT conversions enforced.</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <GitCompare className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Deterministic Engine</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">Transparent rule matching without speculative AI.</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Enterprise Security</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">Independent user accounts & multi-tenant org roles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Operational Screens Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-[#c0edd2] px-2.5 py-1 rounded-md">
            Operational Platform Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 tracking-tight">
            Six Dedicated Operational Consoles
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
            Engineered with high contrast, outdoor-readable agricultural identity, and mobile-first card workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map((screen) => {
            const Icon = screen.icon
            return (
              <Link
                key={screen.title}
                to={screen.href}
                className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:border-[#143d2b] hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c0edd2] text-[#002717] group-hover:bg-[#143d2b] group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#f1f3ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00195d]">
                      {screen.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#143d2b] transition-colors">
                    {screen.title}
                  </h3>

                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {screen.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#143d2b]">
                  <span>Open Console</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
