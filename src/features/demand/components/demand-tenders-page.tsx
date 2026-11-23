
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  MapPin,
  Calendar,
  X,
  MessageSquare,
  Calculator,
  ArrowLeft,
  ClipboardCheck,
} from 'lucide-react'

import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEMAND_TENDERS, COMMODITIES } from '@/data/mock-data'
import type { DemandTender } from '@/types/demand'

type TenderForm = {
  organizationName: string
  commodityName: string
  varietyPreference: string
  requiredQuantityMT: string
  acceptedMoistureMax: string
  state: string
  lga: string
  receivingHub: string
  targetDeliveryDate: string
  targetPricePerMT: string
}

type TenderPreview = {
  organizationName: string
  commodityName: string
  varietyPreference: string
  requiredQuantityMT: number
  acceptedMoistureMax: number | null
  state: string
  lga: string
  receivingHub: string
  targetDeliveryDate: string
  targetPricePerMT: number | null
  estimatedTotal: number | null
}

const createEmptyForm = (): TenderForm => ({
  organizationName: '',
  commodityName: '',
  varietyPreference: '',
  requiredQuantityMT: '',
  acceptedMoistureMax: '',
  state: '',
  lga: '',
  receivingHub: '',
  targetDeliveryDate: '',
  targetPricePerMT: '',
})

const formatCurrency = (amount: number) =>
  `₦${Math.round(amount).toLocaleString('en-NG')}`

const formatDate = (date: string) => {
  if (!date) return 'Not specified'

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const normalizeCropName = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')

const getCommodityByName = (name: string) => {
  const normalizedName = normalizeCropName(name)

  if (!normalizedName) return undefined

  return COMMODITIES.find(
    (crop) =>
      normalizeCropName(crop.name) === normalizedName ||
      normalizeCropName(crop.code) === normalizedName,
  )
}

export function DemandTendersPage() {
  const navigate = useNavigate()

  // Existing records are illustrative local data.
  const [tenders] = useState<DemandTender[]>(DEMAND_TENDERS)

  const [selectedCropFilter, setSelectedCropFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const [form, setForm] = useState<TenderForm>(createEmptyForm)
  const [preview, setPreview] = useState<TenderPreview | null>(null)

  const selectedCrop = getCommodityByName(form.commodityName)

  const quantity = Number(form.requiredQuantityMT) || 0
  const price = Number(form.targetPricePerMT) || 0

  const estimatedTotal =
    quantity > 0 && price > 0 ? quantity * price : 0

  // Build filters from the demand records themselves.
  // This allows custom crop names to appear in the filters too.
  const availableCropFilters = [
    'All',
    ...Array.from(
      new Set(
        tenders
          .map((tender) => tender.commodityName.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b)),
  ]

  const filteredTenders = tenders.filter((tender) => {
    if (selectedCropFilter === 'All') return true

    return (
      normalizeCropName(tender.commodityName) ===
      normalizeCropName(selectedCropFilter)
    )
  })

  const updateField = (field: keyof TenderForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleOpenModal = () => {
    setForm(createEmptyForm())
    setPreview(null)
    setShowPreview(false)
    setNotice(null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setShowPreview(false)
    setPreview(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const commodityName = form.commodityName.trim()

    if (!commodityName || quantity <= 0) return

    if (
      form.acceptedMoistureMax.trim() !== '' &&
      (!Number.isFinite(Number(form.acceptedMoistureMax)) ||
        Number(form.acceptedMoistureMax) < 0 ||
        Number(form.acceptedMoistureMax) > 100)
    ) {
      return
    }

    const total = estimatedTotal > 0 ? estimatedTotal : null

    setPreview({
      organizationName: form.organizationName.trim(),
      commodityName,
      varietyPreference: form.varietyPreference.trim(),
      requiredQuantityMT: quantity,
      acceptedMoistureMax:
        form.acceptedMoistureMax.trim() !== ''
          ? Number(form.acceptedMoistureMax)
          : null,
      state: form.state.trim(),
      lga: form.lga.trim(),
      receivingHub: form.receivingHub.trim(),
      targetDeliveryDate: form.targetDeliveryDate,
      targetPricePerMT: price > 0 ? price : null,
      estimatedTotal: total,
    })

    setShowPreview(true)
  }

  const handleContactBuyer = (tender: DemandTender) => {
    navigate(
      `/inquiries?tender=${tender.id}&buyer=${encodeURIComponent(
        tender.organizationName,
      )}&crop=${encodeURIComponent(tender.commodityName)}`,
    )
  }

  const handleFinishPreview = () => {
    setNotice(
      'Your demand preview is complete. It has not been published or saved to a server.',
    )
    handleCloseModal()
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              Buyer Requests
            </h1>

            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
              {filteredTenders.length} Demo Requests
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-600 sm:text-sm">
            Explore crop requirements from buyers and processors, or create a
            demand request of your own.
          </p>
        </div>

        <Button
          onClick={handleOpenModal}
          icon={<Plus className="h-5 w-5" />}
          size="md"
          variant="amber"
        >
          Post a Demand
        </Button>
      </div>

      {/* Feedback notice */}
      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-700">
          <p>{notice}</p>

          <button
            onClick={() => setNotice(null)}
            className="shrink-0 text-gray-500 hover:text-gray-900"
            aria-label="Dismiss notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Crop filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {availableCropFilters.map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCropFilter(crop)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedCropFilter === crop
                ? 'bg-[#15803d] text-white shadow-xs'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {crop === 'All' ? 'All Crop Requests' : crop}
          </button>
        ))}
      </div>

      {/* Demand cards */}
      {filteredTenders.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTenders.map((tender) => (
            <div
              key={tender.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-[#15803d]"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase text-gray-500">
                    {tender.tenderCode}
                  </span>

                  <StatusBadge status="open" label="Sample · Open" />
                </div>

                <h2 className="text-base font-extrabold tracking-tight text-gray-900">
                  {tender.organizationName}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {tender.organizationType}
                </p>

                {/* Crop and quantity */}
                <div className="my-4 flex items-center justify-between rounded-xl border border-gray-200 bg-[#f8faf7] p-3.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      Crop Wanted
                    </span>

                    <p className="mt-0.5 text-sm font-extrabold text-[#15803d]">
                      {tender.commodityName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      Quantity
                    </span>

                    <p className="mt-0.5 text-lg font-extrabold tabular-nums text-gray-900">
                      {tender.requiredQuantityMT.toLocaleString()} MT
                    </p>
                  </div>
                </div>

                {/* Delivery information */}
                <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

                    <span>
                      <span className="font-semibold text-gray-800">
                        Delivery:
                      </span>{' '}
                      {tender.deliveryLocation.receivingHub}
                      {tender.deliveryLocation.lga
                        ? `, ${tender.deliveryLocation.lga}`
                        : ''}
                      {tender.deliveryLocation.state
                        ? `, ${tender.deliveryLocation.state}`
                        : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                    <span>
                      Needed by: {formatDate(tender.targetDeliveryDate)}
                    </span>
                  </div>

                  {tender.acceptedMoistureMax != null &&
                    tender.acceptedMoistureMax > 0 && (
                      <p className="pt-1 text-[11px] text-gray-500">
                        Maximum moisture: {tender.acceptedMoistureMax}%
                      </p>
                    )}

                  {tender.varietyPreferences &&
                    tender.varietyPreferences.length > 0 && (
                      <p className="pt-1 text-[11px] text-gray-500">
                        Preferred variety:{' '}
                        {tender.varietyPreferences.join(', ')}
                      </p>
                    )}

                  {tender.gradeRequirement && (
                    <p className="pt-1 text-[11px] text-gray-500">
                      Grade requirement: {tender.gradeRequirement}
                    </p>
                  )}
                </div>
              </div>

              {/* Price and action */}
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Target Price
                  </span>

                  <p className="mt-0.5 text-sm font-extrabold tabular-nums text-[#15803d]">
                    {tender.targetPricePerMT != null &&
                    tender.targetPricePerMT > 0
                      ? `${formatCurrency(tender.targetPricePerMT)} / MT`
                      : 'Not specified'}
                  </p>
                </div>

                <Button
                  size="sm"
                  icon={<MessageSquare className="h-4 w-4" />}
                  onClick={() => handleContactBuyer(tender)}
                >
                  View Enquiry
                </Button>
              </div>

              <p className="mt-3 text-[10px] text-gray-400">
                Illustrative record · Not a live buyer request
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <h3 className="font-bold text-gray-900">
            No matching crop requests
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Try another crop filter to explore the available sample requests.
          </p>

          <button
            onClick={() => setSelectedCropFilter('All')}
            className="mt-4 text-xs font-bold text-[#15803d] hover:underline"
          >
            Show all requests
          </button>
        </div>
      )}

      {/* Create demand modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs sm:p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:p-6">
            {!showPreview ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">
                      Create a Demand Request
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Tell suppliers what crop you need and where you need it.
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                    aria-label="Close form"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Buyer information */}
                  <div>
                    <label
                      htmlFor="demand-organization"
                      className="mb-1.5 block text-xs font-bold text-gray-800"
                    >
                      Buyer / Organisation Name
                    </label>

                    <input
                      id="demand-organization"
                      type="text"
                      required
                      value={form.organizationName}
                      onChange={(e) =>
                        updateField('organizationName', e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                      placeholder="Enter buyer or organisation name"
                    />
                  </div>

                  {/* Crop */}
                  <div>
                    <label
                      htmlFor="demand-crop"
                      className="mb-1.5 block text-xs font-bold text-gray-800"
                    >
                      Crop Required
                    </label>

                    <input
                      id="demand-crop"
                      type="text"
                      required
                      list="demand-crop-options"
                      value={form.commodityName}
                      onChange={(e) =>
                        updateField('commodityName', e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                      placeholder="Enter any crop name"
                    />

                    <datalist id="demand-crop-options">
                      {COMMODITIES.map((crop) => (
                        <option key={crop.id} value={crop.name} />
                      ))}
                    </datalist>

                    {selectedCrop ? (
                      <p className="mt-1.5 text-[11px] text-gray-500">
                        Catalogue suggestion: {selectedCrop.description}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[11px] text-gray-500">
                        You can enter a crop that is not currently in the
                        catalogue. You do not need to select a suggested crop.
                      </p>
                    )}
                  </div>

                  {/* Quantity and variety */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="demand-quantity"
                        className="mb-1.5 block text-xs font-bold text-gray-800"
                      >
                        Quantity Required (Tonnes)
                      </label>

                      <input
                        id="demand-quantity"
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        value={form.requiredQuantityMT}
                        onChange={(e) =>
                          updateField('requiredQuantityMT', e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                        placeholder="e.g. 100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="demand-variety"
                        className="mb-1.5 block text-xs font-bold text-gray-800"
                      >
                        Preferred Variety
                        <span className="font-normal text-gray-400">
                          {' '}(Optional)
                        </span>
                      </label>

                      <input
                        id="demand-variety"
                        type="text"
                        value={form.varietyPreference}
                        onChange={(e) =>
                          updateField('varietyPreference', e.target.value)
                        }
                        list="demand-crop-varieties"
                        className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                        placeholder="Any variety"
                      />

                      <datalist id="demand-crop-varieties">
                        {selectedCrop?.varieties.map((variety) => (
                          <option key={variety} value={variety} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <label
                      htmlFor="demand-moisture"
                      className="mb-1.5 block text-xs font-bold text-gray-800"
                    >
                      Maximum Moisture (%)
                      <span className="font-normal text-gray-400">
                        {' '}(Optional)
                      </span>
                    </label>

                    <input
                      id="demand-moisture"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={form.acceptedMoistureMax}
                      onChange={(e) =>
                        updateField('acceptedMoistureMax', e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                      placeholder="e.g. 13.5"
                    />
                  </div>

                  {/* Delivery location */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="mb-3 text-xs font-extrabold text-gray-900">
                      Delivery Requirements
                    </h4>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="demand-state"
                          className="mb-1.5 block text-xs font-bold text-gray-800"
                        >
                          State
                        </label>

                        <input
                          id="demand-state"
                          type="text"
                          required
                          value={form.state}
                          onChange={(e) =>
                            updateField('state', e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                          placeholder="e.g. Oyo"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="demand-lga"
                          className="mb-1.5 block text-xs font-bold text-gray-800"
                        >
                          LGA
                        </label>

                        <input
                          id="demand-lga"
                          type="text"
                          value={form.lga}
                          onChange={(e) =>
                            updateField('lga', e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                          placeholder="e.g. Ibadan North"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label
                        htmlFor="demand-receiving-location"
                        className="mb-1.5 block text-xs font-bold text-gray-800"
                      >
                        Receiving Location
                      </label>

                      <input
                        id="demand-receiving-location"
                        type="text"
                        required
                        value={form.receivingHub}
                        onChange={(e) =>
                          updateField('receivingHub', e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                        placeholder="Factory, warehouse or collection point"
                      />
                    </div>
                  </div>

                  {/* Date and price */}
                  <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="demand-delivery-date"
                        className="mb-1.5 block text-xs font-bold text-gray-800"
                      >
                        Required Delivery Date
                      </label>

                      <input
                        id="demand-delivery-date"
                        type="date"
                        required
                        value={form.targetDeliveryDate}
                        onChange={(e) =>
                          updateField('targetDeliveryDate', e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="demand-target-price"
                        className="mb-1.5 block text-xs font-bold text-gray-800"
                      >
                        Target Price (₦ / Tonne)
                        <span className="font-normal text-gray-400">
                          {' '}(Optional)
                        </span>
                      </label>

                      <input
                        id="demand-target-price"
                        type="number"
                        min="0"
                        step="any"
                        value={form.targetPricePerMT}
                        onChange={(e) =>
                          updateField('targetPricePerMT', e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#15803d] focus:outline-none"
                        placeholder="Your budget per tonne"
                      />
                    </div>
                  </div>

                  {/* Budget calculation */}
                  {estimatedTotal > 0 && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-green-800">
                        <Calculator className="h-4 w-4" />
                        Estimated Total Budget
                      </div>

                      <span className="text-sm font-extrabold tabular-nums text-green-800">
                        {formatCurrency(estimatedTotal)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col-reverse justify-end gap-2 border-t border-gray-200 pt-4 sm:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      size="sm"
                      variant="amber"
                      icon={<ClipboardCheck className="h-4 w-4" />}
                    >
                      Review Demand
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Demand preview */
              preview && (
                <div>
                  <div className="mb-5 flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[#15803d]">
                        <ClipboardCheck className="h-5 w-5" />

                        <span className="text-xs font-bold uppercase tracking-wide">
                          Demand Preview
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-gray-900">
                        Review your requirements
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Check the information before proceeding.
                      </p>
                    </div>

                    <button
                      onClick={handleCloseModal}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                      aria-label="Close preview"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-[#f8faf7] p-4">
                      <p className="text-[10px] font-bold uppercase text-gray-500">
                        Crop Required
                      </p>

                      <h4 className="mt-1 text-xl font-extrabold text-[#15803d]">
                        {preview.commodityName}
                      </h4>

                      <p className="mt-1 text-xs text-gray-600">
                        {preview.varietyPreference || 'No specific variety'}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-gray-500">
                            Quantity
                          </p>

                          <p className="mt-1 text-lg font-extrabold text-gray-900">
                            {preview.requiredQuantityMT.toLocaleString()} MT
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase text-gray-500">
                            Target Price
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-gray-900">
                            {preview.targetPricePerMT !== null
                              ? `${formatCurrency(preview.targetPricePerMT)} / MT`
                              : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-xl border border-gray-200 p-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">
                          Buyer / Organisation
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {preview.organizationName}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">
                          Delivery Location
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {preview.receivingHub}
                        </p>

                        <p className="text-xs text-gray-500">
                          {[preview.lga, preview.state]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">
                          Required Delivery Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatDate(preview.targetDeliveryDate)}
                        </p>
                      </div>

                      {preview.acceptedMoistureMax !== null && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-gray-400">
                            Maximum Moisture
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {preview.acceptedMoistureMax}%
                          </p>
                        </div>
                      )}
                    </div>

                    {preview.estimatedTotal !== null && (
                      <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
                        <span className="text-xs font-bold text-green-800">
                          Estimated Total Budget
                        </span>

                        <span className="text-lg font-extrabold tabular-nums text-green-800">
                          {formatCurrency(preview.estimatedTotal)}
                        </span>
                      </div>
                    )}

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs leading-relaxed text-amber-900">
                        <strong>Preview only:</strong> This demand has not
                        been published, submitted or saved to a server.
                        Backend submission and verification are not connected
                        yet.
                      </p>
                    </div>

                    <div className="flex flex-col-reverse justify-between gap-2 border-t border-gray-200 pt-4 sm:flex-row">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        icon={<ArrowLeft className="h-4 w-4" />}
                        onClick={() => setShowPreview(false)}
                      >
                        Edit Details
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="amber"
                        onClick={handleFinishPreview}
                      >
                        Finish Preview
                      </Button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
