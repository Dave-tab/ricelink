import { useState } from 'react'
import {
  Layers,
  Scale,
  Droplets,
  Calendar,
  MapPin,
  Search,
  BookOpen,
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
      {/* Top Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Crops & Standards Guide
            </h1>
            <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-bold text-[#15803d]">
              Approved Crops
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Learn about accepted crops, standard bag weights in kilograms, and moisture dryness standards required by food factories.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#15803d] bg-[#f0fdf4] px-3.5 py-2 rounded-xl border border-[#bbf7d0]">
          <BookOpen className="h-4 w-4" />
          <span>Official Nigerian Agricultural Standards</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#15803d] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
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
            placeholder="Search crop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
          />
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCommodities.map((crop) => (
          <div
            key={crop.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#15803d] transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    {crop.code}
                  </span>
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                    {crop.name}
                  </h2>
                </div>
                <CategoryBadge category={crop.category} />
              </div>

              {/* Friendly Description */}
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {crop.description}
              </p>

              {/* Key Practical Standards */}
              <div className="space-y-2 border-t border-b border-gray-100 py-3 text-xs">
                {/* Standard Bag Size */}
                <div className="flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-[#15803d] shrink-0" />
                  <span className="text-gray-500 font-semibold">Standard Bag:</span>
                  <span className="font-extrabold text-gray-900">
                    {crop.standardUnits[0].unit} ({crop.standardUnits[0].kgConversion} kg)
                  </span>
                </div>

                {/* Moisture / Dryness */}
                {crop.maxMoistureContent && (
                  <div className="flex items-center gap-2">
                    <Droplets className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="text-gray-500 font-semibold">Must be dry below:</span>
                    <span className="font-extrabold text-gray-900 tabular-nums">
                      {crop.maxMoistureContent}% Moisture
                    </span>
                  </div>
                )}

                {/* Varieties */}
                <div className="flex items-start gap-2">
                  <Layers className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-500 font-semibold shrink-0">Common Seeds:</span>
                  <span className="text-gray-800 font-medium truncate">
                    {crop.varieties.join(', ')}
                  </span>
                </div>

                {/* Harvest Season */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#d97706] shrink-0" />
                  <span className="text-gray-500 font-semibold">Harvest Peak:</span>
                  <span className="text-gray-800 font-medium truncate">
                    {crop.seasonalPeak}
                  </span>
                </div>
              </div>

              {/* Market Activity */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center bg-[#f8faf7] p-2.5 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Available Now</span>
                  <p className="text-sm font-extrabold text-[#15803d] tabular-nums">
                    {crop.activeSupplyMT.toLocaleString()} Tonnes
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Buyers Want</span>
                  <p className="text-sm font-extrabold text-[#d97706] tabular-nums">
                    {crop.activeDemandMT.toLocaleString()} Tonnes
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate max-w-[130px]">
                  {crop.primaryProducingStates.slice(0, 3).join(', ')}
                </span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setActiveModalCommodity(crop)}
                className="text-xs"
              >
                Weight Table
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bag-to-Tonne Conversion Modal */}
      {activeModalCommodity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Measurement Conversion Guide
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
                  {activeModalCommodity.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalCommodity(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Standard commercial weight conversions for buying and selling {activeModalCommodity.name} across Nigeria.
            </p>

            <div className="rounded-xl border border-gray-200 overflow-hidden text-xs mb-5">
              <table className="w-full text-left">
                <thead className="bg-[#f0fdf4] text-[#15803d] font-bold border-b border-[#bbf7d0]">
                  <tr>
                    <th className="p-3">Packaging Type</th>
                    <th className="p-3">Weight in Kg</th>
                    <th className="p-3">How Many = 1 Tonne?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                  {activeModalCommodity.standardUnits.map((u) => {
                    const bagsPerTonne = Math.round(1000 / u.kgConversion)
                    return (
                      <tr key={u.unit} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-gray-900">{u.unit}</td>
                        <td className="p-3 tabular-nums">{u.kgConversion} kg</td>
                        <td className="p-3 font-bold text-[#15803d] tabular-nums">
                          {bagsPerTonne} {u.unit}s = 1 Tonne (MT)
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => setActiveModalCommodity(null)}>
                Close Guide
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
