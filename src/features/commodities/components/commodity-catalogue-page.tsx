
import { useState } from 'react'
import {
  CalendarDays,
  Droplets,
  Info,
  Layers,
  MapPin,
  Search,
  Scale,
  Sprout,
  X,
} from 'lucide-react'
import { COMMODITIES } from '@/data/mock-data'
import type { Commodity } from '@/types/commodity'

export function CommodityCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCommodity, setActiveCommodity] = useState<Commodity | null>(null)

  const categories = [
    'All',
    'Grains',
    'Legumes',
    'Roots & Tubers',
    'Cash Crops',
  ]

  const filteredCommodities = COMMODITIES.filter((commodity) => {
    const query = searchTerm.trim().toLowerCase()

    const matchesCategory =
      selectedCategory === 'All' ||
      commodity.category === selectedCategory

    const matchesSearch =
      !query ||
      commodity.name.toLowerCase().includes(query) ||
      commodity.code.toLowerCase().includes(query) ||
      commodity.description.toLowerCase().includes(query) ||
      commodity.varieties.some((variety) =>
        variety.toLowerCase().includes(query),
      )

    return matchesCategory && matchesSearch
  })

  const closeModal = () => setActiveCommodity(null)

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-700">
                <Sprout size={18} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-green-700">
                Commodity directory
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Crops & Commodities
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Explore agricultural commodities, common varieties, growing
              seasons, producing locations and indicative packaging references.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold tabular-nums text-gray-900">
                {COMMODITIES.length}
              </p>
              <p className="text-xs font-medium text-gray-500">
                Listed commodities
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Search and filters */}
      <section className="space-y-4">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search crops, codes or varieties..."
            aria-label="Search commodities"
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const isActive = selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'border-green-700 bg-green-700 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </section>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Explore commodities
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Showing {filteredCommodities.length} of {COMMODITIES.length} commodities
          </p>
        </div>

        {(searchTerm || selectedCategory !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('All')
            }}
            className="text-xs font-semibold text-green-700 hover:text-green-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Commodity cards */}
      {filteredCommodities.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCommodities.map((commodity) => {
            const primaryUnit = commodity.standardUnits[0]

            return (
              <article
                key={commodity.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
              >
                <div className="flex-1">
                  {/* Commodity identity */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {commodity.code}
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold tracking-tight text-gray-900">
                        {commodity.name}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-800">
                      {commodity.category}
                    </span>
                  </div>

                  <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-gray-500">
                    {commodity.description}
                  </p>

                  {/* Commodity information */}
                  <div className="my-4 space-y-3 border-y border-gray-100 py-4">
                    {primaryUnit && (
                      <div className="flex items-start gap-3">
                        <Scale
                          size={16}
                          className="mt-0.5 shrink-0 text-green-700"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] text-gray-400">
                            First listed packaging reference
                          </p>
                          <p className="text-xs font-bold text-gray-800">
                            {primaryUnit.unit} · {primaryUnit.kgConversion} kg
                          </p>
                        </div>
                      </div>
                    )}

                    {commodity.maxMoistureContent != null && (
                      <div className="flex items-start gap-3">
                        <Droplets
                          size={16}
                          className="mt-0.5 shrink-0 text-blue-500"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] text-gray-400">
                            Listed moisture reference
                          </p>
                          <p className="text-xs font-bold text-gray-800">
                            {commodity.maxMoistureContent}%
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Layers
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-400">
                          Common varieties
                        </p>
                        <p className="text-xs font-medium leading-relaxed text-gray-700">
                          {commodity.varieties.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-400">
                          Seasonal peak
                        </p>
                        <p className="text-xs font-medium text-gray-700">
                          {commodity.seasonalPeak}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Illustrative market figures */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Sample market figures
                      </p>
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-bold text-gray-600">
                        Demo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-medium text-gray-500">
                          Sample supply
                        </p>
                        <p className="mt-1 text-base font-extrabold tabular-nums text-green-700">
                          {commodity.activeSupplyMT.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Metric tonnes
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-gray-500">
                          Sample demand
                        </p>
                        <p className="mt-1 text-base font-extrabold tabular-nums text-amber-600">
                          {commodity.activeDemandMT.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Metric tonnes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Producing locations and action */}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <div className="flex min-w-0 items-start gap-2">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />
                    <p className="truncate text-[11px] text-gray-500">
                      {commodity.primaryProducingStates.slice(0, 3).join(', ')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveCommodity(commodity)}
                    className="shrink-0 rounded-lg border border-green-200 px-3 py-2 text-xs font-bold text-green-700 transition hover:bg-green-50"
                  >
                    View weights
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Search size={22} />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">
            No commodities found
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            We couldn't find a commodity matching your search. Try another name,
            variety or category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('All')
            }}
            className="mt-4 text-sm font-bold text-green-700 hover:text-green-800"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Packaging conversion modal */}
      {activeCommodity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="conversion-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-green-700">
                  Packaging reference
                </p>
                <h2
                  id="conversion-title"
                  className="mt-1 text-xl font-extrabold text-gray-900"
                >
                  {activeCommodity.name}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Indicative weight conversions
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close conversion guide"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed text-amber-900">
                  These are illustrative conversions based on the weights
                  listed in the catalogue. Actual packaging weights should be
                  confirmed with the supplier and buyer before an agreement.
                </p>
              </div>

              {activeCommodity.standardUnits.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[440px] text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="p-3 font-bold">Packaging type</th>
                        <th className="p-3 font-bold">Weight</th>
                        <th className="p-3 font-bold">
                          Approx. units per tonne
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {activeCommodity.standardUnits.map((unit, index) => {
                        const bagsPerTonne =
                          unit.kgConversion > 0
                            ? 1000 / unit.kgConversion
                            : 0

                        return (
                          <tr key={`${unit.unit}-${index}`}>
                            <td className="p-3 font-bold text-gray-900">
                              {unit.unit}
                            </td>
                            <td className="p-3 tabular-nums text-gray-700">
                              {unit.kgConversion.toLocaleString()} kg
                            </td>
                            <td className="p-3 font-bold tabular-nums text-green-700">
                              {bagsPerTonne > 0
                                ? bagsPerTonne.toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })
                                : '—'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  No packaging references have been added for this commodity.
                </p>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
                >
                  Close guide
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
