import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  MapPin,
  Calendar,
  X,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEMAND_TENDERS, COMMODITIES } from '@/data/mock-data'
import type { DemandTender } from '@/types/demand'

export function DemandTendersPage() {
  const navigate = useNavigate()
  const [tenders, setTenders] = useState<DemandTender[]>(DEMAND_TENDERS)
  const [selectedCropFilter, setSelectedCropFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  // New buyer request form
  const [newTender, setNewTender] = useState({
    organizationName: 'Premier Rice Processors Ltd',
    commodityId: 'faro-44-rice',
    requiredQuantityMT: 100,
    acceptedMoistureMax: 13.0,
    state: 'Kano',
    receivingHub: 'Bompai Factory Mill',
    targetDeliveryDate: '2026-12-10',
    targetPricePerMT: 710000,
  })

  const selectedCrop = COMMODITIES.find((c) => c.id === newTender.commodityId) || COMMODITIES[0]

  const filteredTenders = tenders.filter((t) => {
    if (selectedCropFilter === 'All') return true
    return t.commodityName.toLowerCase().includes(selectedCropFilter.toLowerCase())
  })

  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault()
    const tender: DemandTender = {
      id: `dt-${Date.now()}`,
      tenderCode: `TND-${selectedCrop.code}-2026-${Math.floor(100 + Math.random() * 900)}`,
      buyerName: 'Procurement Officer',
      organizationName: newTender.organizationName,
      organizationType: 'Industrial Processor',
      commodityId: newTender.commodityId,
      commodityName: selectedCrop.name,
      varietyPreferences: selectedCrop.varieties,
      requiredQuantityMT: Number(newTender.requiredQuantityMT),
      acceptedMoistureMax: Number(newTender.acceptedMoistureMax),
      gradeRequirement: 'Standard Industrial Quality',
      deliveryLocation: {
        state: newTender.state,
        lga: 'Industrial Hub',
        receivingHub: newTender.receivingHub,
      },
      targetDeliveryDate: newTender.targetDeliveryDate,
      status: 'open',
      postedDate: new Date().toISOString().split('T')[0],
      targetPricePerMT: Number(newTender.targetPricePerMT),
    }

    setTenders([tender, ...tenders])
    setSuccessNotice(`Procurement order for ${tender.requiredQuantityMT} Tonnes of ${tender.commodityName} published!`)
    setModalOpen(false)
    setTimeout(() => setSuccessNotice(null), 5000)
  }

  const handleContactBuyer = (tender: DemandTender) => {
    navigate(`/inquiries?tender=${tender.id}&buyer=${encodeURIComponent(tender.organizationName)}&crop=${encodeURIComponent(tender.commodityName)}`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Buyer Requests (Demand)
            </h1>
            <span className="rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-xs font-bold text-[#b45309]">
              {filteredTenders.length} Active Orders
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Real purchase requests from verified flour mills, rice parboilers, and food companies looking for crops to buy.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          icon={<Plus className="h-5 w-5" />}
          size="md"
          variant="amber"
        >
          + Post What You Want to Buy
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

      {/* Simple Crop Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', 'Rice', 'Maize', 'Cassava', 'Soybeans'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCropFilter(crop)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCropFilter === crop
                ? 'bg-[#15803d] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {crop === 'All' ? 'All Crop Requests' : `${crop} Orders`}
          </button>
        ))}
      </div>

      {/* Buyer Request Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTenders.map((tender) => (
          <div
            key={tender.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#15803d] transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase">{tender.tenderCode}</span>
                <StatusBadge status="open" label="Open Order" />
              </div>

              {/* Buyer Name & Type */}
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                {tender.organizationName}
              </h2>
              <p className="text-xs text-gray-500 font-medium">{tender.organizationType}</p>

              {/* Quantity Block */}
              <div className="my-3 p-3.5 rounded-xl bg-[#f8faf7] border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Crop Wanted</span>
                  <p className="text-sm font-extrabold text-[#15803d] mt-0.5">{tender.commodityName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Quantity</span>
                  <p className="text-lg font-extrabold text-gray-900 tabular-nums mt-0.5">
                    {tender.requiredQuantityMT} Tonnes
                  </p>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="font-semibold text-gray-800">
                    Deliver to: {tender.deliveryLocation.receivingHub}, {tender.deliveryLocation.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span>Needed by: {tender.targetDeliveryDate}</span>
                </div>
                <div className="text-[11px] text-gray-500 pt-1">
                  Dryness required: maximum {tender.acceptedMoistureMax}% moisture
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Budget Price</span>
                <p className="text-sm font-extrabold text-[#15803d] tabular-nums">
                  ₦{(tender.targetPricePerMT || 0).toLocaleString()} / Tonne
                </p>
              </div>

              <Button
                size="sm"
                icon={<MessageSquare className="h-4 w-4" />}
                onClick={() => handleContactBuyer(tender)}
              >
                I Have This
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Buyer Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Post What You Want to Buy
                </h3>
                <p className="text-xs text-gray-500">
                  Suppliers and farmer cooperatives will contact you with matching crops
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Your Company or Cooperative Name
                </label>
                <input
                  type="text"
                  required
                  value={newTender.organizationName}
                  onChange={(e) =>
                    setNewTender({ ...newTender, organizationName: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#15803d] focus:outline-none"
                  placeholder="e.g. Premier Rice Mills Ltd"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Which crop do you need?
                </label>
                <select
                  value={newTender.commodityId}
                  onChange={(e) =>
                    setNewTender({ ...newTender, commodityId: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-bold focus:border-[#15803d] focus:outline-none"
                >
                  {COMMODITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Quantity Needed (Tonnes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTender.requiredQuantityMT}
                    onChange={(e) =>
                      setNewTender({ ...newTender, requiredQuantityMT: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-extrabold tabular-nums focus:border-[#15803d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Your Budget (₦ / Tonne)
                  </label>
                  <input
                    type="number"
                    required
                    value={newTender.targetPricePerMT}
                    onChange={(e) =>
                      setNewTender({ ...newTender, targetPricePerMT: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-extrabold tabular-nums focus:border-[#15803d] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Delivery State
                  </label>
                  <input
                    type="text"
                    required
                    value={newTender.state}
                    onChange={(e) => setNewTender({ ...newTender, state: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#15803d] focus:outline-none"
                    placeholder="e.g. Kano"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Needed by Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTender.targetDeliveryDate}
                    onChange={(e) =>
                      setNewTender({ ...newTender, targetDeliveryDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#15803d] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Factory / Receiving Warehouse Address
                </label>
                <input
                  type="text"
                  required
                  value={newTender.receivingHub}
                  onChange={(e) => setNewTender({ ...newTender, receivingHub: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#15803d] focus:outline-none"
                  placeholder="e.g. Bompai Mill Intake Gate"
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
                <Button type="submit" size="sm" variant="amber">
                  Publish Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
