import { useState } from 'react'
import {
  Layers,
  Scale,
  Droplets,
  Calendar,
  MapPin,
  Search,
} from 'lucide-react'
import { CategoryBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COMMODITIES } from '@/data/mock-data'
import type { Commodity } from '@/types/commodity'

export function CommodityCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeModalCommodity, setActiveModalCommodity] = useState<Commodity | null>(null)

  const categories = ['All', 'Grains', 'Legumes', 'Roots & Tubers', 'Cash Crops']

  const filteredCommodities = COMMODITIES.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#143d2b]">
              Universal Commodity Catalogue
            </h1>
            <span className="rounded bg-[#c0edd2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#002113]">
              Standardized Schema
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Approved agricultural commodities, certified grade parameters, moisture thresholds, and controlled packaging conversions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 bg-[#f8f9fa] px-3 py-2 rounded-xl border border-gray-200">
          <Scale className="h-4 w-4 text-[#143d2b]" />
          <span>Strict Measurement Enforcement Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#143d2b] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search crop or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b]"
          />
        </div>
      </div>

      {/* Commodity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCommodities.map((crop) => (
          <div
            key={crop.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#143d2b] hover:shadow-sm transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                    {crop.code}
                  </span>
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                    {crop.name}
                  </h2>
                </div>
                <CategoryBadge category={crop.category} />
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                {crop.description}
              </p>

              {/* Key Specs */}
              <div className="space-y-2 border-t border-b border-gray-100 py-3 text-xs">
                {/* Varieties */}
                <div className="flex items-start gap-2">
                  <Layers className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-500 font-medium shrink-0">Varieties:</span>
                  <span className="text-gray-800 font-semibold truncate">
                    {crop.varieties.join(', ')}
                  </span>
                </div>

                {/* Moisture Threshold */}
                {crop.maxMoistureContent && (
                  <div className="flex items-center gap-2">
                    <Droplets className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="text-gray-500 font-medium">Max Moisture:</span>
                    <span className="font-bold text-gray-900 tabular-nums">
                      {crop.maxMoistureContent}% MC
                    </span>
                  </div>
                )}

                {/* Packaging & Unit Rules */}
                <div className="flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-medium">Packaging Units:</span>
                  <span className="text-gray-800 font-semibold">
                    {crop.standardUnits.map((u) => u.unit).join(' • ')}
                  </span>
                </div>

                {/* Seasonal Peak */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="text-gray-500 font-medium">Harvest Peak:</span>
                  <span className="text-gray-800 font-semibold text-[11px] truncate">
                    {crop.seasonalPeak}
                  </span>
                </div>
              </div>

              {/* Market Metrics */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center bg-[#f8f9fa] p-2.5 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Active Supply</span>
                  <p className="text-sm font-extrabold text-emerald-800 tabular-nums">
                    {crop.activeSupplyMT.toLocaleString()} MT
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Buyer Demand</span>
                  <p className="text-sm font-extrabold text-[#143d2b] tabular-nums">
                    {crop.activeDemandMT.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-4 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[140px]">
                  {crop.primaryProducingStates.slice(0, 3).join(', ')}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveModalCommodity(crop)}
                className="text-xs"
              >
                Inspect Specs
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Commodity Detail Modal */}
      {activeModalCommodity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">
                  {activeModalCommodity.code} • {activeModalCommodity.category}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
                  {activeModalCommodity.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalCommodity(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {activeModalCommodity.description}
            </p>

            {/* Approved Grades */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Certified Quality Grades & Parameters
              </h4>
              <div className="space-y-2">
                {activeModalCommodity.grades.map((grade) => (
                  <div
                    key={grade.code}
                    className="p-3 rounded-xl border border-gray-200 bg-[#f8f9fa]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{grade.label}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700">
                        {grade.code}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{grade.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicit Measurement Conversion Table */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Controlled Measurement Unit Conversions
              </h4>
              <div className="rounded-xl border border-gray-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f1f3ff] text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">Packaging Unit</th>
                      <th className="p-2.5">Kg Equivalent</th>
                      <th className="p-2.5">Metric Tonnes (MT) Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {activeModalCommodity.standardUnits.map((u) => (
                      <tr key={u.unit} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold">{u.unit}</td>
                        <td className="p-2.5 tabular-nums">{u.kgConversion} kg</td>
                        <td className="p-2.5 tabular-nums">{(u.kgConversion / 1000).toFixed(3)} MT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <Button size="sm" onClick={() => setActiveModalCommodity(null)}>
                Close Specification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
