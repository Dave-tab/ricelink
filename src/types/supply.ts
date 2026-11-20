export type SupplyBatchStatus =
  | 'verified'
  | 'in_aggregation'
  | 'inspected'
  | 'allocated'
  | 'in_transit'

export interface SupplyBatch {
  id: string
  batchCode: string
  commodityId: string
  commodityName: string
  variety: string
  quantity: number
  unit: string
  metricTonnes: number
  packaging: string
  grade: string
  moistureContent: number
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
