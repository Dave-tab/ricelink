import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Plus,
  MapPin,
  Building2,
  X,
  CheckCircle2,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SUPPLY_BATCHES, COMMODITIES } from '@/data/mock-data'
import type { SupplyBatch } from '@/types/supply'

export function SupplyManagementPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [batches, setBatches] = useState<SupplyBatch[]>(SUPPLY_BATCHES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    commodityId: 'faro-44-rice',
    variety: 'Faro 44 (Sipi)',
    quantity: 500,
    unit: '50kg Bag',
    moistureContent: 12.8,
    state: 'Kebbi',
    lga: 'Argungu',
    facilityName: 'Wurno Central Aggregation Shed',
    askingPrice: 700000,
  })

  // Open modal automatically if ?action=new is in the URL
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenNewModal()
    }
  }, [searchParams])

  const selectedCrop = COMMODITIES.find((c) => c.id === formData.commodityId) || COMMODITIES[0]
  const activeUnitConfig = selectedCrop.standardUnits.find((u) => u.unit === formData.unit)
  const calculatedMT = activeUnitConfig
    ? (formData.quantity * activeUnitConfig.kgConversion) / 1000
    : formData.quantity

  const handleOpenNewModal = () => {
    setEditingBatchId(null)
    setFormData({
      commodityId: 'faro-44-rice',
      variety: 'Faro 44 (Sipi)',
      quantity: 500,
      unit: '50kg Bag',
      moistureContent: 12.8,
      state: 'Kebbi',
      lga: 'Argungu',
      facilityName: 'Wurno Central Aggregation Shed',
      askingPrice: 700000,
    })
    setModalOpen(true)
  }

  const handleEditBatch = (batch: SupplyBatch) => {
    setEditingBatchId(batch.id)
    setFormData({
      commodityId: batch.commodityId,
      variety: batch.variety,
      quantity: batch.quantity,
      unit: batch.unit,
      moistureContent: batch.moistureContent,
      state: batch.location.state,
      lga: batch.location.lga,
      facilityName: batch.location.facilityName,
      askingPrice: batch.askingPricePerMT || 700000,
    })
    setModalOpen(true)
  }

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingBatchId) {
      // Update existing batch
      setBatches(
        batches.map((b) => {
          if (b.id === editingBatchId) {
            return {
              ...b,
              commodityId: formData.commodityId,
              commodityName: selectedCrop.name,
              variety: formData.variety,
              quantity: Number(formData.quantity),
              unit: formData.unit,
              metricTonnes: calculatedMT,
              moistureContent: Number(formData.moistureContent),
              location: {
                ...b.location,
                facilityName: formData.facilityName,
                state: formData.state,
                lga: formData.lga,
              },
              askingPricePerMT: Number(formData.askingPrice),
            }
          }
          return b
        })
      )
      setSuccessNotice(`Updated lot specifications successfully!`)
    } else {
      // Create new batch
      const newBatch: SupplyBatch = {
        id: `sb-${Date.now()}`,
        batchCode: `LOT-${selectedCrop.code}-2026-${Math.floor(100 + Math.random() * 900)}`,
        commodityId: formData.commodityId,
        commodityName: selectedCrop.name,
        variety: formData.variety,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        metricTonnes: calculatedMT,
        packaging: `${formData.unit} Standard`,
        grade: 'Grade 1 (Standard Quality)',
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
      setSuccessNotice(`New lot ${newBatch.batchCode} listed for sale!`)
    }

    setModalOpen(false)
    setTimeout(() => setSuccessNotice(null), 5000)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Produce for Sale (Your Supply)
            </h1>
            <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-bold text-[#15803d]">
              {batches.length} Listed Lots
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            List crops you have harvested or have in storage so buyers, mills, and food companies across Nigeria can find you.
          </p>
        </div>

        <Button
          onClick={handleOpenNewModal}
          icon={<Plus className="h-5 w-5" />}
          size="md"
          className="bg-[#15803d] hover:bg-[#166534]"
        >
          + List New Crops for Sale
        </Button>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] font-bold text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-[#15803d] hover:text-[#166534] font-extrabold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Produce Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#15803d] transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500">{batch.batchCode}</span>
                <StatusBadge status="verified" label="Active & Ready" />
              </div>

              {/* Crop & Variety */}
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
                {batch.commodityName}
              </h2>
              <p className="text-xs text-gray-600 font-medium">Variety: {batch.variety}</p>

              {/* Big, Visible Quantity Block */}
              <div className="my-3 p-3.5 rounded-xl bg-[#f8faf7] border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Bags / Packages
                  </span>
                  <p className="text-xl font-extrabold text-gray-900 tabular-nums">
                    {batch.quantity.toLocaleString()} <span className="text-xs font-bold text-gray-600">{batch.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803d]">
                    Total Weight
                  </span>
                  <p className="text-xl font-extrabold text-[#15803d] tabular-nums">
                    {batch.metricTonnes} Tonnes
                  </p>
                </div>
              </div>

              {/* Storage & Quality Info */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="font-medium">
                    {batch.location.facilityName}, {batch.location.state} State
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="font-semibold text-gray-800">{batch.organizationName}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-semibold pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#15803d] shrink-0" />
                  <span>Moisture Tested: {batch.moistureContent}% (Safe for storage & transport)</span>
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Asking Price</span>
                <p className="text-sm font-extrabold text-[#15803d] tabular-nums">
                  ₦{(batch.askingPricePerMT || 0).toLocaleString()} / Tonne
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEditBatch(batch)}
                >
                  Edit Lot
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/matches')}
                >
                  View Buyers
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple 3-Step Listing / Editing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  {editingBatchId ? 'Edit Listed Produce Lot' : 'List Your Crops for Sale'}
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in these simple details so buyers can contact you
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-4 text-xs">
              {/* Step 1: Pick Crop */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  1. Which crop do you have?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMODITIES.map((c) => {
                    const isSelected = formData.commodityId === c.id
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            commodityId: c.id,
                            variety: c.varieties[0] || '',
                            unit: c.standardUnits[0].unit,
                          })
                        }}
                        className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#15803d] bg-[#dcfce7] text-[#15803d]'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <p className="truncate text-xs">{c.name}</p>
                        <p className="text-[10px] font-semibold text-gray-500">{c.category}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Variety selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Variety / Seed Type
                </label>
                <select
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
                >
                  {selectedCrop.varieties.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Quantity & Bags */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  2. How much do you have?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">Number of Bags / Units</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full mt-1 rounded-xl border border-gray-300 p-2.5 text-sm font-extrabold tabular-nums focus:border-[#15803d] focus:outline-none"
                      placeholder="e.g. 500"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">Packaging Unit</span>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full mt-1 rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
                    >
                      {selectedCrop.standardUnits.map((u) => (
                        <option key={u.unit} value={u.unit}>
                          {u.unit} ({u.kgConversion} kg)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Auto-calculated total */}
                <div className="mt-2 p-3 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-between">
                  <span className="font-bold text-[#15803d] text-xs">Total in Metric Tonnes:</span>
                  <span className="text-base font-extrabold text-[#15803d] tabular-nums">
                    {calculatedMT.toFixed(2)} Tonnes (MT)
                  </span>
                </div>
              </div>

              {/* Step 3: Location and Price */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  3. Where is the produce stored?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">State</span>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full mt-1 rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#15803d] focus:outline-none"
                      placeholder="e.g. Kebbi"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">Town or Warehouse</span>
                    <input
                      type="text"
                      required
                      value={formData.facilityName}
                      onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                      className="w-full mt-1 rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#15803d] focus:outline-none"
                      placeholder="e.g. Argungu Central Depot"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Your Asking Price (₦ per Tonne)
                </label>
                <input
                  type="number"
                  required
                  value={formData.askingPrice}
                  onChange={(e) => setFormData({ ...formData, askingPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-extrabold tabular-nums focus:border-[#15803d] focus:outline-none"
                  placeholder="e.g. 700000"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#15803d] hover:bg-[#166534]">
                  {editingBatchId ? 'Save Changes' : 'Confirm & Put on Sale'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
