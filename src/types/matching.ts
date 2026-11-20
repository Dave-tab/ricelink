import type { SupplyBatch } from './supply'
import type { DemandTender } from './demand'

export type MatchStatus = 'recommended' | 'inquiry_sent' | 'reserved' | 'declined'

export interface CompatibilityMatch {
  id: string
  supplyBatch: SupplyBatch
  demandTender: DemandTender
  overallScore: number // 0 - 100%
  breakdown: {
    commodityMatch: number // %
    varietyMatch: boolean
    moistureCompliance: boolean
    distanceKm: number
    locationScore: number // %
    volumeFulfillableMT: number
    volumePercentage: number // %
  }
  status: MatchStatus
  calculatedAt: string
}
