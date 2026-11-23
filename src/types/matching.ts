
import type { SupplyBatch } from './supply'
import type { DemandTender } from './demand'

export type MatchStatus =
  | 'recommended'
  | 'inquiry_sent'
  | 'reserved'
  | 'declined'

export type CropMatchMethod =
  | 'catalogue_id'
  | 'exact_name'

/**
 * Describes how close the supply and demand locations are.
 * Nearby LGA and neighbouring-state classification will require
 * reliable geographic reference data.
 */
export type LocationMatchTier =
  | 'same_lga'
  | 'nearby_lga'
  | 'same_state'
  | 'neighbouring_state'
  | 'wider_market'
  | 'unknown'

/**
 * Identifies how a compatibility result was produced.
 * AI-assisted matching is reserved for a future enhancement.
 */
export type MatchingMethod =
  | 'rule_based'
  | 'ai_assisted'

/**
 * A single factor contributing to the overall compatibility score.
 */
export interface MatchFactorScore {
  weight: number
  score: number | null
  status: 'met' | 'partial' | 'not_met' | 'unknown'
  explanation: string
}

/**
 * Transparent breakdown of the five matching factors.
 */
export interface MatchScoreFactors {
  location: MatchFactorScore
  quantity: MatchFactorScore
  quality: MatchFactorScore
  variety: MatchFactorScore
  deliveryTiming: MatchFactorScore
}

export interface CompatibilityMatch {
  id: string

  supplyBatch: SupplyBatch
  demandTender: DemandTender

  /**
   * Overall compatibility percentage.
   * A null value means there is insufficient information to calculate it.
   */
  overallScore: number | null

  matchingMethod: MatchingMethod

  breakdown: {
    commodityMatch: number
    cropMatchMethod?: CropMatchMethod

    varietyMatch: boolean | null
    moistureCompliance: boolean | null
    qualityMatch?: boolean | null
    deliveryTimingMatch?: boolean | null

    /**
     * Location classification and distance.
     * Distance remains optional until reliable geographic data is available.
     */
    locationTier?: LocationMatchTier
    distanceKm?: number
    locationScore: number | null

    /**
     * Quantity information.
     */
    volumeFulfillableMT: number
    volumePercentage: number

    /**
     * Individual scoring factors and their explanations.
     */
    factors?: MatchScoreFactors
  }

  status: MatchStatus
  calculatedAt: string
}
