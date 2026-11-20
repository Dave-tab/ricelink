export type DemandTenderStatus =
  | 'open'
  | 'evaluating'
  | 'partially_matched'
  | 'fulfilled'
  | 'closed'

export interface DemandTender {
  id: string
  tenderCode: string
  buyerName: string
  organizationName: string
  organizationType: 'Industrial Processor' | 'Off-taker' | 'Institutional Buyer' | 'Aggregator'
  commodityId: string
  commodityName: string
  varietyPreferences: string[]
  requiredQuantityMT: number
  acceptedMoistureMax: number
  gradeRequirement: string
  deliveryLocation: {
    state: string
    lga: string
    receivingHub: string
  }
  targetDeliveryDate: string
  status: DemandTenderStatus
  postedDate: string
  targetPricePerMT?: number
}
