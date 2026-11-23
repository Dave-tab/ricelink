
import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Plus,
  MapPin,
  Building2,
  X,
  Calculator,
  Package,
  Sprout,
  Scale,
  Droplets,
  ArrowLeft,
  CheckCircle2,
  Eye,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SUPPLY_BATCHES, COMMODITIES } from '@/data/mock-data'
import type { SupplyBatch } from '@/types/supply'

interface ListingForm {
  commodityName: string
  commodityId: string
  variety: string
  quantity: string
  unit: string
  kgPerUnit: string
  moistureContent: string
  state: string
  lga: string
  facilityName: string
  askingPrice: string
}

const createEmptyForm = (): ListingForm => ({
  commodityName: '',
  commodityId: '',
  variety: '',
  quantity: '',
  unit: '',
  kgPerUnit: '',
  moistureContent: '',
  state: '',
  lga: '',
  facilityName: '',
  askingPrice: '',
})

const normalizeCropName = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')

const getCommodityByName = (name: string) =>
  COMMODITIES.find(
    (commodity) =>
      normalizeCropName(commodity.name) === normalizeCropName(name) ||
      normalizeCropName(commodity.code) === normalizeCropName(name),
  )

const getKnownUnitConversion = (unit: string): number | undefined => {
  const normalized = unit.trim().toLowerCase()

  if (
    ['tonne', 'tonnes', 'metric tonne', 'metric tonnes', 'mt'].includes(
      normalized,
    )
  ) {
    return 1000
  }

  if (['kg', 'kilogram', 'kilograms'].includes(normalized)) {
    return 1
  }

  return undefined
}

export function SupplyManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [batches, setBatches] = useState<SupplyBatch[]>(SUPPLY_BATCHES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ListingForm>(createEmptyForm)

  const selectedCrop = getCommodityByName(formData.commodityName)

  const quantity = Number(formData.quantity) || 0
  const enteredKgPerUnit = Number(formData.kgPerUnit)

  const kgPerUnit =
    formData.kgPerUnit.trim() && enteredKgPerUnit > 0
      ? enteredKgPerUnit
      : getKnownUnitConversion(formData.unit)

  const calculatedMT =
    kgPerUnit !== undefined ? (quantity * kgPerUnit) / 1000 : undefined

  const askingPrice = Number(formData.askingPrice) || 0

  const calculatedTotalValue =
    calculatedMT !== undefined ? calculatedMT * askingPrice : undefined

  const moistureContent = Number(formData.moistureContent)

  const updateField = <K extends keyof ListingForm>(
    field: K,
    value: ListingForm[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleCropNameChange = (value: string) => {
    const matchedCrop = getCommodityByName(value)

    setFormData((current) => ({
      ...current,
      commodityName: value,
      commodityId: matchedCrop?.id ?? '',
    }))
  }

  const openNewListing = () => {
    setEditingBatchId(null)
    setFormData(createEmptyForm())
    setPreviewMode(false)
    setFormError(null)
    setModalOpen(true)
  }

  const openEditListing = (batch: SupplyBatch) => {
    setEditingBatchId(batch.id)

    setFormData({
      commodityName: batch.commodityName,
      commodityId: batch.commodityId ?? '',
      variety: batch.variety ?? '',
      quantity: String(batch.quantity),
      unit: batch.unit,
      kgPerUnit: '',
      moistureContent:
        batch.moistureContent != null
          ? String(batch.moistureContent)
          : '',
      state: batch.location.state,
      lga: batch.location.lga,
      facilityName: batch.location.facilityName,
      askingPrice:
        batch.askingPricePerMT != null
          ? String(batch.askingPricePerMT)
          : '',
    })

    setPreviewMode(false)
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setPreviewMode(false)
    setFormError(null)
  }

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openNewListing()

      setSearchParams(
        (current) => {
          const updated = new URLSearchParams(current)
          updated.delete('action')
          return updated
        },
        { replace: true },
      )
    }
  }, [searchParams, setSearchParams])

  const handlePreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!formData.commodityName.trim()) {
      setFormError('Enter the name of the crop you are supplying.')
      return
    }

    if (!quantity || quantity <= 0) {
      setFormError('Enter a quantity greater than zero.')
      return
    }

    if (!formData.unit.trim()) {
      setFormError('Enter the unit used to measure your produce.')
      return
    }

    if (
      formData.kgPerUnit.trim() &&
      (Number.isNaN(enteredKgPerUnit) || enteredKgPerUnit <= 0)
    ) {
      setFormError('Package weight must be greater than zero.')
      return
    }

    if (!formData.state.trim() || !formData.lga.trim()) {
      setFormError(
        'Please provide the state and LGA where the produce is located.',
      )
      return
    }

    if (!formData.facilityName.trim()) {
      setFormError(
        'Please provide the farm, collection point or storage location.',
      )
      return
    }

    if (!formData.askingPrice || askingPrice <= 0) {
      setFormError('Enter an asking price greater than zero.')
      return
    }

    if (
      formData.moistureContent.trim() &&
      (Number.isNaN(moistureContent) ||
        moistureContent < 0 ||
        moistureContent > 100)
    ) {
      setFormError('Moisture content must be between 0 and 100%.')
      return
    }

    setPreviewMode(true)
  }

  const handleConfirm = () => {
    if (editingBatchId) {
      setBatches((current) =>
        current.map((batch) => {
          if (batch.id !== editingBatchId) return batch

          return {
            ...batch,
            commodityId: selectedCrop?.id,
            commodityName: formData.commodityName.trim(),
            variety: formData.variety.trim() || undefined,
            quantity,
            unit: formData.unit.trim(),
            metricTonnes: calculatedMT,
            moistureContent: formData.moistureContent.trim()
              ? moistureContent
              : undefined,
            location: {
              ...batch.location,
              facilityName: formData.facilityName.trim(),
              state: formData.state.trim(),
              lga: formData.lga.trim(),
            },
            askingPricePerMT: askingPrice,
          }
        }),
      )

      setSuccessNotice(
        'Your local preview has been updated. Changes have not been sent to a server.',
      )
    } else {
      setSuccessNotice(
        'Your listing preview is ready. It has not been published or saved to a server.',
      )
    }

    closeModal()
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              My Supply
            </h1>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
              {batches.length} sample lots
            </span>
          </div>

          <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
            Keep track of agricultural produce available from farms,
            collection points and storage locations.
          </p>
        </div>

        <Button
          onClick={openNewListing}
          icon={<Plus size={18} />}
          size="md"
          className="shrink-0"
        >
          List produce
        </Button>
      </section>

      {successNotice && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4"
        >
          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <span>{successNotice}</span>
          </div>

          <button
            type="button"
            onClick={() => setSuccessNotice(null)}
            aria-label="Dismiss notification"
            className="text-green-700 hover:text-green-900"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {batches.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {batches.map((batch) => (
            <article
              key={batch.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-green-300 hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-500">
                    {batch.batchCode}
                  </span>

                  <StatusBadge
                    status={batch.status}
                    label={`Sample · ${batch.status.replaceAll('_', ' ')}`}
                  />
                </div>

                <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
                  {batch.commodityName}
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Variety: {batch.variety || 'Not specified'}
                </p>

                <div className="my-4 grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Quantity
                    </p>

                    <p className="mt-1 text-lg font-extrabold tabular-nums text-gray-900">
                      {batch.quantity.toLocaleString()}
                    </p>

                    <p className="text-[10px] text-gray-500">{batch.unit}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                      Total weight
                    </p>

                    <p className="mt-1 text-lg font-extrabold tabular-nums text-green-700">
                      {batch.metricTonnes != null
                        ? batch.metricTonnes.toFixed(2)
                        : 'Not available'}
                    </p>

                    <p className="text-[10px] text-gray-500">Metric tonnes</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />

                    <div>
                      <p className="font-semibold text-gray-800">
                        {batch.location.facilityName}
                      </p>

                      <p>
                        {batch.location.lga}, {batch.location.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-gray-600">
                    <Building2 size={15} className="mt-0.5 shrink-0 text-gray-400" />

                    <div>
                      <p className="font-semibold text-gray-800">
                        {batch.organizationName}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Organisation shown in sample record
                      </p>
                    </div>
                  </div>

                  {batch.moistureContent != null && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Droplets size={15} className="shrink-0 text-blue-500" />

                      <span>
                        Recorded moisture content: {batch.moistureContent}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    Sample asking price
                  </p>

                  <p className="mt-1 text-sm font-extrabold tabular-nums text-green-700">
                    {batch.askingPricePerMT != null
                      ? `₦${batch.askingPricePerMT.toLocaleString()} / MT`
                      : 'Not specified'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditListing(batch)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => navigate('/matches')}
                  >
                    Explore matches
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
          <Package size={30} className="mx-auto text-gray-400" />

          <h3 className="mt-3 font-bold text-gray-900">
            No sample supply records
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Start by preparing a produce listing preview.
          </p>

          <Button onClick={openNewListing} className="mt-4">
            Create listing preview
          </Button>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="supply-modal-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                  <Sprout size={15} />
                  SUPPLY LISTING
                </div>

                <h2
                  id="supply-modal-title"
                  className="mt-1 text-xl font-extrabold text-gray-900"
                >
                  {previewMode
                    ? 'Review your produce'
                    : editingBatchId
                      ? 'Edit produce details'
                      : 'List your produce'}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {previewMode
                    ? 'Check the information before finishing your preview.'
                    : 'Provide the essential information about your produce.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close listing form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            {!previewMode ? (
              <form
                onSubmit={handlePreview}
                className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6"
              >
                <div>
                  <label
                    htmlFor="commodity-name"
                    className="mb-1.5 block text-xs font-bold text-gray-800"
                  >
                    Crop name
                  </label>

                  <input
                    id="commodity-name"
                    required
                    list="known-crops"
                    value={formData.commodityName}
                    onChange={(event) =>
                      handleCropNameChange(event.target.value)
                    }
                    placeholder="e.g. Rice, Yam, Millet, Ginger, Sesame"
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                  />

                  <datalist id="known-crops">
                    {COMMODITIES.map((crop) => (
                      <option key={crop.id} value={crop.name} />
                    ))}
                  </datalist>

                  <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">
                    Select a suggested crop or type any crop name. You are not
                    restricted to the catalogue.
                  </p>
                </div>

                {selectedCrop && (
                  <div className="rounded-xl border border-green-100 bg-green-50/60 p-4">
                    <div className="flex items-center gap-2">
                      <Sprout size={17} className="text-green-700" />

                      <p className="text-sm font-bold text-green-900">
                        Catalogue information available
                      </p>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-gray-600">
                      {selectedCrop.description}
                    </p>

                    <p className="mt-2 text-[11px] text-gray-600">
                      Common varieties: {selectedCrop.varieties.join(', ')}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-600">
                      This information is a reference. You can enter a
                      different variety or leave it unspecified.
                    </p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="variety"
                    className="mb-1.5 block text-xs font-bold text-gray-800"
                  >
                    Variety / type (optional)
                  </label>

                  <input
                    id="variety"
                    list="crop-varieties"
                    value={formData.variety}
                    onChange={(event) =>
                      updateField('variety', event.target.value)
                    }
                    placeholder="Enter a variety if known"
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                  />

                  <datalist id="crop-varieties">
                    {selectedCrop?.varieties.map((variety) => (
                      <option key={variety} value={variety} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-bold text-gray-800">
                    How much produce do you have?
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="quantity"
                        className="mb-1 block text-[11px] text-gray-500"
                      >
                        Quantity
                      </label>

                      <input
                        id="quantity"
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        value={formData.quantity}
                        onChange={(event) =>
                          updateField('quantity', event.target.value)
                        }
                        placeholder="e.g. 500"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="unit"
                        className="mb-1 block text-[11px] text-gray-500"
                      >
                        Measurement unit
                      </label>

                      <input
                        id="unit"
                        required
                        list="common-units"
                        value={formData.unit}
                        onChange={(event) =>
                          updateField('unit', event.target.value)
                        }
                        placeholder="e.g. bags"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                      />

                      <datalist id="common-units">
                        <option value="Metric tonnes" />
                        <option value="Tonnes" />
                        <option value="Kg" />
                        <option value="50kg bags" />
                        <option value="100kg bags" />
                        <option value="Baskets" />
                        <option value="Heaps" />
                        <option value="Crates" />
                        <option value="Sacks" />
                      </datalist>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label
                      htmlFor="kg-per-unit"
                      className="mb-1.5 block text-xs font-semibold text-gray-700"
                    >
                      Weight per unit in kilograms (optional)
                    </label>

                    <input
                      id="kg-per-unit"
                      type="number"
                      min="0.001"
                      step="any"
                      value={formData.kgPerUnit}
                      onChange={(event) =>
                        updateField('kgPerUnit', event.target.value)
                      }
                      placeholder="e.g. 50 for a 50kg bag"
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                    />

                    <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">
                      Only enter a weight you know. RiceLink will not assume
                      that every bag, basket or heap has the same weight.
                    </p>
                  </div>

                  {calculatedMT !== undefined && calculatedMT > 0 && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-green-100 bg-green-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-green-800">
                        <Calculator size={16} />
                        Estimated weight
                      </div>

                      <p className="text-sm font-extrabold tabular-nums text-green-800">
                        {calculatedMT.toLocaleString(undefined, {
                          maximumFractionDigits: 3,
                        })}{' '}
                        MT
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-bold text-gray-800">
                    Where is the produce located?
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="state"
                        className="mb-1 block text-[11px] text-gray-500"
                      >
                        State
                      </label>

                      <input
                        id="state"
                        required
                        value={formData.state}
                        onChange={(event) =>
                          updateField('state', event.target.value)
                        }
                        placeholder="e.g. Kebbi"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lga"
                        className="mb-1 block text-[11px] text-gray-500"
                      >
                        LGA
                      </label>

                      <input
                        id="lga"
                        required
                        value={formData.lga}
                        onChange={(event) =>
                          updateField('lga', event.target.value)
                        }
                        placeholder="e.g. Argungu"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label
                      htmlFor="facility"
                      className="mb-1 block text-[11px] text-gray-500"
                    >
                      Farm, collection point or storage location
                    </label>

                    <input
                      id="facility"
                      required
                      value={formData.facilityName}
                      onChange={(event) =>
                        updateField('facilityName', event.target.value)
                      }
                      placeholder="Enter the location name"
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="asking-price"
                    className="mb-1.5 block text-xs font-bold text-gray-800"
                  >
                    Asking price per metric tonne (₦)
                  </label>

                  <input
                    id="asking-price"
                    type="number"
                    min="0.01"
                    step="any"
                    required
                    value={formData.askingPrice}
                    onChange={(event) =>
                      updateField('askingPrice', event.target.value)
                    }
                    placeholder="e.g. 680000"
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                  />
                </div>

                <details className="rounded-xl border border-gray-200 p-4">
                  <summary className="cursor-pointer text-xs font-bold text-gray-800">
                    Additional quality details (optional)
                  </summary>

                  <div className="mt-4">
                    <label
                      htmlFor="moisture"
                      className="mb-1.5 block text-xs font-medium text-gray-700"
                    >
                      Measured moisture content (%)
                    </label>

                    <input
                      id="moisture"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.moistureContent}
                      onChange={(event) =>
                        updateField('moistureContent', event.target.value)
                      }
                      placeholder="e.g. 12.5"
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                    />

                    <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
                      Enter a measured value if available. Do not enter an
                      estimated value as a tested result.
                    </p>
                  </div>
                </details>

                {formError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700"
                  >
                    {formError}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    size="sm"
                    icon={<Eye size={15} />}
                  >
                    Preview listing
                  </Button>
                </div>
              </form>
            ) : (
              <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <Eye size={17} className="text-blue-700" />

                    <p className="text-sm font-bold text-blue-900">
                      Listing preview
                    </p>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-blue-800">
                    This is how the information you've entered can be
                    presented to potential buyers. It is not yet published.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Produce listing preview
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold text-gray-900">
                        {formData.commodityName}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {formData.variety.trim() || 'Variety not specified'}
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
                      Not published
                    </span>
                  </div>

                  <div className="my-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold text-gray-500">
                        Quantity
                      </p>

                      <p className="mt-1 text-lg font-extrabold text-gray-900">
                        {quantity.toLocaleString()}
                      </p>

                      <p className="text-[10px] text-gray-500">
                        {formData.unit}
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-[10px] font-semibold text-green-700">
                        Estimated weight
                      </p>

                      <p className="mt-1 text-lg font-extrabold text-green-800">
                        {calculatedMT !== undefined
                          ? calculatedMT.toLocaleString(undefined, {
                              maximumFractionDigits: 3,
                            })
                          : 'Not available'}
                      </p>

                      <p className="text-[10px] text-green-700">
                        Metric tonnes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-gray-100 pt-4 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 text-gray-400" />

                      <div>
                        <p className="font-semibold text-gray-800">
                          {formData.facilityName}
                        </p>

                        <p className="mt-0.5 text-gray-500">
                          {formData.lga}, {formData.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Scale size={16} className="mt-0.5 text-gray-400" />

                      <div>
                        <p className="font-semibold text-gray-800">
                          ₦{askingPrice.toLocaleString()} per metric tonne
                        </p>

                        <p className="mt-0.5 text-gray-500">
                          Asking price
                        </p>
                      </div>
                    </div>

                    {formData.moistureContent.trim() && (
                      <div className="flex items-start gap-3">
                        <Droplets size={16} className="mt-0.5 text-gray-400" />

                        <div>
                          <p className="font-semibold text-gray-800">
                            {moistureContent}%
                          </p>

                          <p className="mt-0.5 text-gray-500">
                            User-entered moisture content
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {calculatedTotalValue !== undefined && (
                    <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
                      <p className="text-xs font-semibold text-amber-900">
                        Estimated total lot value
                      </p>

                      <p className="mt-1 text-xl font-extrabold tabular-nums text-amber-900">
                        ₦{Math.round(calculatedTotalValue).toLocaleString()}
                      </p>

                      <p className="mt-1 text-[10px] text-amber-800">
                        Calculated from estimated weight × asking price per
                        tonne. Final commercial terms may differ.
                      </p>
                    </div>
                  )}

                  {calculatedMT === undefined && (
                    <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                      Total weight and lot value cannot be estimated until
                      the weight per measurement unit is known.
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    icon={<ArrowLeft size={15} />}
                    onClick={() => {
                      setPreviewMode(false)
                      setFormError(null)
                    }}
                  >
                    Back to edit
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleConfirm}
                    icon={<CheckCircle2 size={15} />}
                  >
                    {editingBatchId ? 'Finish editing' : 'Finish preview'}
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
