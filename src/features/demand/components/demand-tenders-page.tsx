import { useState } from 'react'
import {
  Plus,
  MapPin,
  Calendar,
  Droplets,
  Scale,
  Search,
  X,
  ArrowRight,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEMAND_TENDERS, COMMODITIES } from '@/data/mock-data'
import type { DemandTender } from '@/types/demand'

export function DemandTendersPage() {
  const [tenders, setTenders] = useState<DemandTender[]>(DEMAND_TENDERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // New tender form
  const [newTender, setNewTender] = useState({
    buyerName: 'Alhaji Sani Bello',
    organizationName: 'Premier Rice Processors Ltd',
    organizationType: 'Industrial Processor' as const,
    commodityId: 'faro-44-rice',
    requiredQuantityMT: 150,
    acceptedMoistureMax: 13.0,
    gradeRequirement: 'Grade 1 (Premium Milling)',
    state: 'Kano',
    lga: 'Bompai',
    receivingHub: 'Bompai Silo Complex',
    targetDeliveryDate: '2026-12-15',
    targetPricePerMT: 720000,
  })

  const selectedCrop = COMMODITIES.find((c) => c.id === newTender.commodityId)

  const filteredTenders = tenders.filter((t) => {
    const q = searchTerm.toLowerCase()
    return (
      t.commodityName.toLowerCase().includes(q) ||
      t.organizationName.toLowerCase().includes(q) ||
      t.deliveryLocation.state.toLowerCase().includes(q)
    )
  })

  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault()
    const tender: DemandTender = {
      id: `dt-${Date.now()}`,
      tenderCode: `TND-${selectedCrop?.code || 'CRP'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      buyerName: newTender.buyerName,
      organizationName: newTender.organizationName,
      organizationType: newTender.organizationType,
      commodityId: newTender.commodityId,
      commodityName: selectedCrop?.name || 'Produce',
      varietyPreferences: selectedCrop?.varieties || [],
      requiredQuantityMT: Number(newTender.requiredQuantityMT),
      acceptedMoistureMax: Number(newTender.acceptedMoistureMax),
      gradeRequirement: newTender.gradeRequirement,
      deliveryLocation: {
        state: newTender.state,
        lga: newTender.lga,
        receivingHub: newTender.receivingHub,
      },
      targetDeliveryDate: newTender.targetDeliveryDate,
      status: 'open',
      postedDate: new Date().toISOString().split('T')[0],
      targetPricePerMT: Number(newTender.targetPricePerMT),
    }

    setTenders([tender, ...tenders])
    setDrawerOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#143d2b]">
              Procurement Demand & Buyer Tenders
            </h1>
            <span className="rounded bg-[#ffdbca] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#331200]">
              Commercial Sourcing
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Publish forward procurement requirements, intake specifications, and contract delivery schedules for agricultural processors and institutional buyers.
          </p>
        </div>

        <Button
          onClick={() => setDrawerOpen(true)}
          icon={<Plus className="h-4 w-4" />}
          size="sm"
        >
          Publish Procurement Tender
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tender by crop, buyer, state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b]"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-semibold">
          <span>{filteredTenders.length} active procurement requests</span>
        </div>
      </div>

      {/* Tenders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTenders.map((tender) => (
          <div
            key={tender.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#143d2b] transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {tender.tenderCode}
                </span>
                <StatusBadge status="verified" label="OPEN TENDER" />
              </div>

              {/* Organization and Title */}
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                {tender.organizationName}
              </h2>
              <p className="text-xs text-gray-500 font-medium">{tender.organizationType}</p>

              {/* Required Commodity & Quantity Banner */}
              <div className="my-3 p-3 rounded-xl bg-[#f8f9fa] border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Target Commodity
                    </span>
                    <p className="font-extrabold text-gray-900 text-sm mt-0.5">
                      {tender.commodityName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">
                      Required Volume
                    </span>
                    <p className="text-lg font-extrabold text-[#143d2b] tabular-nums mt-0.5">
                      {tender.requiredQuantityMT} MT
                    </p>
                  </div>
                </div>
              </div>

              {/* Specs & Intake Tolerances */}
              <div className="space-y-2 text-xs text-gray-600 border-t border-b border-gray-100 py-3">
                <div className="flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="text-gray-500 font-medium">Max Moisture:</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    &lt;= {tender.acceptedMoistureMax}% MC
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-medium">Quality Grade:</span>
                  <span className="font-semibold text-gray-800">{tender.gradeRequirement}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="text-gray-500 font-medium">Target Delivery:</span>
                  <span className="font-bold text-gray-900">{tender.targetDeliveryDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-700 truncate">
                    {tender.deliveryLocation.receivingHub}, {tender.deliveryLocation.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Budget Quote</span>
                <p className="text-sm font-extrabold text-gray-900 tabular-nums">
                  ₦{(tender.targetPricePerMT || 0).toLocaleString()} / MT
                </p>
              </div>

              <Button size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />} className="text-xs">
                Submit Lot
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* New Procurement Tender Modal */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Publish Procurement Tender
                </h3>
                <p className="text-xs text-gray-500">
                  Post institutional raw material requirements for cluster sourcing
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Procuring Organization
                </label>
                <input
                  type="text"
                  required
                  value={newTender.organizationName}
                  onChange={(e) =>
                    setNewTender({ ...newTender, organizationName: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#143d2b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Commodity
                </label>
                <select
                  value={newTender.commodityId}
                  onChange={(e) =>
                    setNewTender({ ...newTender, commodityId: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#143d2b] focus:outline-none"
                >
                  {COMMODITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Required Quantity (MT)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTender.requiredQuantityMT}
                    onChange={(e) =>
                      setNewTender({ ...newTender, requiredQuantityMT: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-bold tabular-nums focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Max Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newTender.acceptedMoistureMax}
                    onChange={(e) =>
                      setNewTender({ ...newTender, acceptedMoistureMax: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs tabular-nums focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Target Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTender.targetDeliveryDate}
                    onChange={(e) =>
                      setNewTender({ ...newTender, targetDeliveryDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Off-take State
                  </label>
                  <input
                    type="text"
                    required
                    value={newTender.state}
                    onChange={(e) => setNewTender({ ...newTender, state: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Intake Facility / Receiving Gate
                </label>
                <input
                  type="text"
                  required
                  value={newTender.receivingHub}
                  onChange={(e) => setNewTender({ ...newTender, receivingHub: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Budget (₦ / MT)
                </label>
                <input
                  type="number"
                  required
                  value={newTender.targetPricePerMT}
                  onChange={(e) =>
                    setNewTender({ ...newTender, targetPricePerMT: Number(e.target.value) })
                  }
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
                  Publish Tender
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
