import { useState } from 'react'
import {
  Plus,
  MapPin,
  Building2,
  X,
} from 'lucide-react'
import { StatusBadge, CommodityMetricPill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SUPPLY_BATCHES, COMMODITIES } from '@/data/mock-data'
import type { SupplyBatch } from '@/types/supply'

export function SupplyManagementPage() {
  const [batches, setBatches] = useState<SupplyBatch[]>(SUPPLY_BATCHES)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    commodityId: 'faro-44-rice',
    variety: 'Faro 44 (Sipi)',
    quantity: 500,
    unit: '50kg Bag',
    packaging: '50kg PP Woven Bags (Sealed)',
    grade: 'Grade 1 (Premium Milling)',
    moistureContent: 12.5,
    state: 'Kebbi',
    lga: 'Argungu',
    facilityName: 'Wurno Central Aggregation Shed',
    askingPrice: 700000,
  })

  // Dynamic conversion
  const selectedCrop = COMMODITIES.find((c) => c.id === formData.commodityId)
  const activeUnitConfig = selectedCrop?.standardUnits.find((u) => u.unit === formData.unit)
  const calculatedMT = activeUnitConfig
    ? (formData.quantity * activeUnitConfig.kgConversion) / 1000
    : formData.quantity

  const filteredBatches = batches.filter((b) => {
    if (statusFilter === 'all') return true
    return b.status === statusFilter
  })

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault()
    const newBatch: SupplyBatch = {
      id: `sb-${Date.now()}`,
      batchCode: `LOT-${selectedCrop?.code || 'CRP'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      commodityId: formData.commodityId,
      commodityName: selectedCrop?.name || 'Agricultural Produce',
      variety: formData.variety,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      metricTonnes: calculatedMT,
      packaging: formData.packaging,
      grade: formData.grade,
      moistureContent: Number(formData.moistureContent),
      location: {
        facilityName: formData.facilityName,
        state: formData.state,
        lga: formData.lga,
      },
      ownerName: 'Musa Abdullahi',
      organizationName: 'Argungu Rice Farmers Cooperative Union',
      status: 'verified',
      harvestDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      askingPricePerMT: Number(formData.askingPrice),
    }

    setBatches([newBatch, ...batches])
    setDrawerOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#143d2b]">
              Supply Management & Harvest Batches
            </h1>
            <span className="rounded bg-[#c0edd2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#002113]">
              Producer & Aggregator Desk
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Publish consolidated produce lots, track physical depot inventories, and inspect certified laboratory parameters.
          </p>
        </div>

        <Button
          onClick={() => setDrawerOpen(true)}
          icon={<Plus className="h-4 w-4" />}
          size="sm"
        >
          Allocate New Harvest Batch
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Batches' },
          { id: 'verified', label: 'Verified Active' },
          { id: 'in_aggregation', label: 'In Aggregation' },
          { id: 'inspected', label: 'Lab Inspected' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-[#143d2b] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#143d2b] transition-all"
          >
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {batch.batchCode}
                </span>
                <StatusBadge status={batch.status} label={batch.status.replace('_', ' ').toUpperCase()} />
              </div>

              {/* Title & Variety */}
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
                {batch.commodityName}
              </h2>
              <p className="text-xs text-gray-600 font-medium">Variety: {batch.variety}</p>

              {/* Explicit Weight and Metric Conversion Banner */}
              <div className="my-3 flex items-center justify-between p-3 rounded-xl bg-[#f8f9fa] border border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Allocated Volume
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-extrabold text-gray-900 tabular-nums">
                      {batch.quantity.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-gray-600">{batch.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Explicit MT Basis
                  </span>
                  <div className="text-xl font-extrabold text-[#143d2b] tabular-nums mt-0.5">
                    {batch.metricTonnes} MT
                  </div>
                </div>
              </div>

              {/* Attribute badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <CommodityMetricPill
                  volume={batch.metricTonnes}
                  unit="MT"
                  spec={batch.grade}
                  moisture={batch.moistureContent}
                />
              </div>

              {/* Location & Organization */}
              <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">
                    {batch.location.facilityName}, {batch.location.lga}, {batch.location.state} State
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="truncate font-medium text-gray-800">
                    {batch.organizationName}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Price Basis</span>
                <p className="text-sm font-extrabold text-emerald-800 tabular-nums">
                  ₦{(batch.askingPricePerMT || 0).toLocaleString()} / MT
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Lot Manifest
                </Button>
                <Button size="sm" className="text-xs">
                  Match Buyers
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Supply Allocation Modal / Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Allocate New Harvest Batch
                </h3>
                <p className="text-xs text-gray-500">
                  Register physical produce inventory for aggregation and matching
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              {/* Commodity Select */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Select Commodity
                </label>
                <select
                  value={formData.commodityId}
                  onChange={(e) => {
                    const c = COMMODITIES.find((item) => item.id === e.target.value)
                    setFormData({
                      ...formData,
                      commodityId: e.target.value,
                      variety: c?.varieties[0] || '',
                      unit: c?.standardUnits[0].unit || '50kg Bag',
                    })
                  }}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#143d2b] focus:outline-none"
                >
                  {COMMODITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Variety */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Variety
                </label>
                <select
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                >
                  {selectedCrop?.varieties.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity and Unit with Auto-Conversion */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-bold tabular-nums focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                  >
                    {selectedCrop?.standardUnits.map((u) => (
                      <option key={u.unit} value={u.unit}>
                        {u.unit} ({u.kgConversion} kg)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic MT Conversion Banner */}
              <div className="p-3 rounded-xl bg-[#c0edd2]/40 border border-[#a5d0b7] flex items-center justify-between">
                <span className="font-semibold text-gray-700">Calculated Metric Tonnes:</span>
                <span className="text-base font-extrabold text-[#002717] tabular-nums">
                  {calculatedMT.toFixed(2)} MT
                </span>
              </div>

              {/* Moisture & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.moistureContent}
                    onChange={(e) =>
                      setFormData({ ...formData, moistureContent: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs tabular-nums focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                  >
                    {selectedCrop?.grades.map((g) => (
                      <option key={g.code} value={g.label}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    LGA
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Depot / Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.facilityName}
                  onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Asking Price (₦ / MT)
                </label>
                <input
                  type="number"
                  required
                  value={formData.askingPrice}
                  onChange={(e) => setFormData({ ...formData, askingPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-bold tabular-nums focus:border-[#143d2b] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setDrawerOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Confirm & Allocate Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
