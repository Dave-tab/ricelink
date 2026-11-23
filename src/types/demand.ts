
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
  organizationType:
    | 'Industrial Processor'
    | 'Off-taker'
    | 'Institutional Buyer'
    | 'Aggregator'

  // Catalogue reference is optional for custom crops.
  commodityId?: string
  commodityName: string

  // Buyers may specify a variety or leave it open.
  varietyPreferences?: string[]

  requiredQuantityMT: number

  // Optional quality requirements.
  acceptedMoistureMax?: number
  gradeRequirement?: string

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
