
export type SupplyBatchStatus =
  | 'verified'
  | 'in_aggregation'
  | 'inspected'
  | 'allocated'
  | 'in_transit'

export interface SupplyBatch {
  id: string
  batchCode: string

  // A catalogue reference is optional because users can list custom crops.
  commodityId?: string
  commodityName: string

  // These details may not be known when a listing is created.
  variety?: string
  grade?: string
  moistureContent?: number
  packaging?: string

  quantity: number
  unit: string

  // Only available when the quantity can be reliably converted.
  metricTonnes?: number

  location: {
    facilityName: string
    state: string
    lga: string
  }

  ownerName: string
  organizationName: string
  status: SupplyBatchStatus
  harvestDate: string
  createdAt: string
  askingPricePerMT?: number
}
