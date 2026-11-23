
import type { SupplyBatch } from '@/types/supply'
import type { DemandTender } from '@/types/demand'
import type {
  CompatibilityMatch,
  LocationMatchTier,
  MatchFactorScore,
  MatchScoreFactors,
} from '@/types/matching'

const SCORE_WEIGHTS = {
  location: 30,
  quantity: 25,
  quality: 20,
  variety: 15,
  deliveryTiming: 10,
} as const

const LOCATION_PRIORITY: Record<LocationMatchTier, number> = {
  same_lga: 1,
  nearby_lga: 2,
  same_state: 3,
  neighbouring_state: 4,
  wider_market: 5,
  unknown: 6,
}

function normalize(value?: string): string {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function isPositiveFiniteNumber(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value > 0
  )
}

/**
 * Converts a supply quantity to metric tonnes only when
 * the supplied unit provides enough information.
 *
 * Unknown or ambiguous units are not guessed.
 */
function getSupplyQuantityMT(batch: SupplyBatch): number | null {
  if (isPositiveFiniteNumber(batch.metricTonnes)) {
    return batch.metricTonnes
  }

  if (!isPositiveFiniteNumber(batch.quantity)) {
    return null
  }

  const unit = normalize(batch.unit)

  // A quantity already expressed in kilograms.
  if (
    unit === 'kg' ||
    unit === 'kilogram' ||
    unit === 'kilograms'
  ) {
    return batch.quantity / 1000
  }

  // Units explicitly expressed in metric tonnes.
  if (
    unit === 'mt' ||
    unit === 'metric tonne' ||
    unit === 'metric tonnes' ||
    unit === 'metric ton' ||
    unit === 'metric tons' ||
    unit === 'tonne' ||
    unit === 'tonnes'
  ) {
    return batch.quantity
  }

  // Recognise units such as "50kg Bag" or "100 kg bag".
  const kgMatch = unit.match(/(\d+(?:\.\d+)?)\s*kg/)

  if (kgMatch) {
    const kgPerUnit = Number(kgMatch[1])

    if (isPositiveFiniteNumber(kgPerUnit)) {
      return (batch.quantity * kgPerUnit) / 1000
    }
  }

  // Do not guess the weight of a bag, basket, truckload or heap.
  return null
}

function getCropMatch(
  supply: SupplyBatch,
  demand: DemandTender,
): {
  matches: boolean
  method?: 'catalogue_id' | 'exact_name'
} {
  const supplyId = normalize(supply.commodityId)
  const demandId = normalize(demand.commodityId)

  // When both records have catalogue IDs, IDs must match.
  if (supplyId && demandId) {
    return supplyId === demandId
      ? { matches: true, method: 'catalogue_id' }
      : { matches: false }
  }

  // Do not pair a catalogue crop with an unidentified custom crop.
  if (supplyId || demandId) {
    return { matches: false }
  }

  // Custom crops can match by exact normalized name.
  const supplyName = normalize(supply.commodityName)
  const demandName = normalize(demand.commodityName)

  if (supplyName && supplyName === demandName) {
    return { matches: true, method: 'exact_name' }
  }

  return { matches: false }
}

function getLocationTier(
  supply: SupplyBatch,
  demand: DemandTender,
): LocationMatchTier {
  const supplyState = normalize(supply.location.state)
  const demandState = normalize(demand.deliveryLocation.state)

  const supplyLga = normalize(supply.location.lga)
  const demandLga = normalize(demand.deliveryLocation.lga)

  if (!supplyState || !demandState) {
    return 'unknown'
  }

  if (supplyState === demandState) {
    if (
      supplyLga &&
      demandLga &&
      supplyLga === demandLga
    ) {
      return 'same_lga'
    }

    return 'same_state'
  }

  // Neighbouring-state relationships need geographic reference data.
  return 'wider_market'
}

function createFactor(
  weight: number,
  score: number | null,
  status: MatchFactorScore['status'],
  explanation: string,
): MatchFactorScore {
  return {
    weight,
    score,
    status,
    explanation,
  }
}

function getLocationFactor(
  tier: LocationMatchTier,
): MatchFactorScore {
  const scores: Record<LocationMatchTier, number | null> = {
    same_lga: 100,
    nearby_lga: 90,
    same_state: 75,
    neighbouring_state: 55,
    wider_market: 40,
    unknown: null,
  }

  const explanations: Record<LocationMatchTier, string> = {
    same_lga: 'Supply and delivery are recorded in the same LGA.',
    nearby_lga: 'Supply and delivery are in geographically neighbouring LGAs.',
    same_state: 'Supply and delivery are recorded in the same state.',
    neighbouring_state: 'Supply is in a neighbouring state.',
    wider_market: 'Supply is recorded outside the buyer’s state.',
    unknown: 'Location information is insufficient for comparison.',
  }

  const score = scores[tier]

  return createFactor(
    SCORE_WEIGHTS.location,
    score,
    score === null ? 'unknown' : 'met',
    explanations[tier],
  )
}

function getQuantityFactor(
  supplyMT: number,
  demandMT: number,
): MatchFactorScore {
  const percentage = Math.min(
    (supplyMT / demandMT) * 100,
    100,
  )

  const score = Math.round(percentage)

  return createFactor(
    SCORE_WEIGHTS.quantity,
    score,
    score >= 100 ? 'met' : 'partial',
    supplyMT >= demandMT
      ? `Recorded supply quantity can cover the full ${demandMT} MT requirement.`
      : `Recorded supply quantity covers approximately ${score}% of the ${demandMT} MT requirement.`,
  )
}

function getQualityFactor(
  supply: SupplyBatch,
  demand: DemandTender,
): MatchFactorScore {
  const knownScores: number[] = []
  const missingRequirements: string[] = []
  const explanations: string[] = []

  const hasMoistureRequirement =
    typeof demand.acceptedMoistureMax === 'number' &&
    Number.isFinite(demand.acceptedMoistureMax)

  const hasGradeRequirement =
    Boolean(normalize(demand.gradeRequirement))

  if (hasMoistureRequirement) {
    if (
      typeof supply.moistureContent === 'number' &&
      Number.isFinite(supply.moistureContent)
    ) {
      const moisturePasses =
        supply.moistureContent <= demand.acceptedMoistureMax!

      knownScores.push(moisturePasses ? 100 : 0)

      explanations.push(
        moisturePasses
          ? 'Recorded moisture is within the buyer’s stated limit.'
          : 'Recorded moisture exceeds the buyer’s stated limit.',
      )
    } else {
      missingRequirements.push('moisture information')
      explanations.push('Supply moisture has not been recorded.')
    }
  }

  if (hasGradeRequirement) {
    if (normalize(supply.grade)) {
      const gradeMatches =
        normalize(supply.grade) ===
        normalize(demand.gradeRequirement)

      knownScores.push(gradeMatches ? 100 : 50)

      explanations.push(
        gradeMatches
          ? 'Supply grade label matches the buyer’s requested grade.'
          : 'Grade labels differ. Their specifications require buyer confirmation.',
      )
    } else {
      missingRequirements.push('grade information')
      explanations.push('Supply grade has not been recorded.')
    }
  }

  if (!hasMoistureRequirement && !hasGradeRequirement) {
    return createFactor(
      SCORE_WEIGHTS.quality,
      null,
      'unknown',
      'The buyer has not specified moisture or grade requirements.',
    )
  }

  // Do not give a complete quality score when a requested criterion is missing.
  if (missingRequirements.length > 0) {
    return createFactor(
      SCORE_WEIGHTS.quality,
      null,
      'unknown',
      `${explanations.join(' ')} A complete assessment requires ${missingRequirements.join(' and ')}.`,
    )
  }

  const score = Math.round(
    knownScores.reduce((total, value) => total + value, 0) /
      knownScores.length,
  )

  return createFactor(
    SCORE_WEIGHTS.quality,
    score,
    score === 100
      ? 'met'
      : score > 0
        ? 'partial'
        : 'not_met',
    explanations.join(' '),
  )
}

function getVarietyFactor(
  supply: SupplyBatch,
  demand: DemandTender,
): MatchFactorScore {
  const preferences = (demand.varietyPreferences ?? [])
    .map(normalize)
    .filter(Boolean)

  if (preferences.length === 0) {
    return createFactor(
      SCORE_WEIGHTS.variety,
      null,
      'unknown',
      'The buyer has not specified a variety preference.',
    )
  }

  const supplyVariety = normalize(supply.variety)

  if (!supplyVariety) {
    return createFactor(
      SCORE_WEIGHTS.variety,
      null,
      'unknown',
      'The supply variety has not been recorded.',
    )
  }

  const matches = preferences.includes(supplyVariety)

  return createFactor(
    SCORE_WEIGHTS.variety,
    matches ? 100 : 0,
    matches ? 'met' : 'not_met',
    matches
      ? 'Supply variety matches one of the buyer’s listed preferences.'
      : 'Supply variety does not match the buyer’s listed preferences.',
  )
}

function getDeliveryFactor(
  supply: SupplyBatch,
  demand: DemandTender,
): MatchFactorScore {
  const harvestDate = Date.parse(supply.harvestDate)
  const deliveryDate = Date.parse(demand.targetDeliveryDate)

  if (
    !Number.isFinite(harvestDate) ||
    !Number.isFinite(deliveryDate)
  ) {
    return createFactor(
      SCORE_WEIGHTS.deliveryTiming,
      null,
      'unknown',
      'Harvest or requested delivery date is unavailable.',
    )
  }

  const harvestBeforeDeadline = harvestDate <= deliveryDate

  return createFactor(
    SCORE_WEIGHTS.deliveryTiming,
    harvestBeforeDeadline ? 100 : 0,
    harvestBeforeDeadline ? 'met' : 'not_met',
    harvestBeforeDeadline
      ? 'Recorded harvest date is on or before the requested delivery deadline. Transport readiness is not assessed.'
      : 'Recorded harvest date is after the requested delivery deadline.',
  )
}

function calculateOverallScore(
  factors: MatchScoreFactors,
): number | null {
  const knownFactors = Object.values(factors).filter(
    (factor) => factor.score !== null,
  )

  if (knownFactors.length === 0) {
    return null
  }

  const totalKnownWeight = knownFactors.reduce(
    (total, factor) => total + factor.weight,
    0,
  )

  if (totalKnownWeight === 0) {
    return null
  }

  const weightedScore = knownFactors.reduce(
    (total, factor) =>
      total + (factor.score ?? 0) * factor.weight,
    0,
  )

  return Math.round(weightedScore / totalKnownWeight)
}

function isSupplyEligible(batch: SupplyBatch): boolean {
  // These statuses indicate that the supply should not generate
  // another fresh opportunity.
  return (
    batch.status !== 'allocated' &&
    batch.status !== 'in_transit'
  )
}

function isDemandEligible(demand: DemandTender): boolean {
  return [
    'open',
    'evaluating',
    'partially_matched',
  ].includes(demand.status)
}

function createMatch(
  supply: SupplyBatch,
  demand: DemandTender,
): CompatibilityMatch | null {
  const cropMatch = getCropMatch(supply, demand)

  if (!cropMatch.matches) {
    return null
  }

  const supplyMT = getSupplyQuantityMT(supply)

  if (
    supplyMT === null ||
    !isPositiveFiniteNumber(demand.requiredQuantityMT)
  ) {
    return null
  }

  // A recorded moisture failure makes the supply ineligible.
  if (
    typeof supply.moistureContent === 'number' &&
    Number.isFinite(supply.moistureContent) &&
    typeof demand.acceptedMoistureMax === 'number' &&
    Number.isFinite(demand.acceptedMoistureMax) &&
    supply.moistureContent > demand.acceptedMoistureMax
  ) {
    return null
  }

  const locationTier = getLocationTier(supply, demand)
  const deliveryFactor = getDeliveryFactor(supply, demand)

  // A recorded harvest date after the deadline is ineligible.
  if (deliveryFactor.status === 'not_met') {
    return null
  }

  const qualityFactor = getQualityFactor(supply, demand)
  const varietyFactor = getVarietyFactor(supply, demand)

  const quantityFactor = getQuantityFactor(
    supplyMT,
    demand.requiredQuantityMT,
  )

  const locationFactor = getLocationFactor(locationTier)

  const factors: MatchScoreFactors = {
    location: locationFactor,
    quantity: quantityFactor,
    quality: qualityFactor,
    variety: varietyFactor,
    deliveryTiming: deliveryFactor,
  }

  const overallScore = calculateOverallScore(factors)

  const volumeFulfillableMT = Math.min(
    supplyMT,
    demand.requiredQuantityMT,
  )

  return {
    id: `${supply.id}-${demand.id}`,
    supplyBatch: supply,
    demandTender: demand,
    overallScore,
    matchingMethod: 'rule_based',
    breakdown: {
      commodityMatch: 100,
      cropMatchMethod: cropMatch.method,
      varietyMatch:
        varietyFactor.score === null
          ? null
          : varietyFactor.score === 100,
      moistureCompliance:
        typeof supply.moistureContent !== 'number' ||
        typeof demand.acceptedMoistureMax !== 'number'
          ? null
          : supply.moistureContent <= demand.acceptedMoistureMax,
      qualityMatch:
        qualityFactor.score === null
          ? null
          : qualityFactor.score >= 80,
      deliveryTimingMatch:
        deliveryFactor.score === null
          ? null
          : deliveryFactor.score === 100,
      locationTier,
      locationScore: locationFactor.score,
      volumeFulfillableMT,
      volumePercentage: Math.round(
        (volumeFulfillableMT / demand.requiredQuantityMT) * 100,
      ),
      factors,
    },
    status: 'recommended',
    calculatedAt: new Date().toISOString(),
  }
}

/**
 * Generates deterministic candidate matches from supply and demand.
 *
 * Matching rules:
 * - Crop identity must match.
 * - Supply must have a usable quantity.
 * - Allocated and in-transit supply is excluded.
 * - Recorded moisture failures are excluded.
 * - Recorded harvest dates after the deadline are excluded.
 * - Unknown information is not automatically treated as a pass.
 * - Results are prioritised by location, then calculated score.
 */
export function generateCompatibilityMatches(
  supplies: SupplyBatch[],
  demands: DemandTender[],
): CompatibilityMatch[] {
  const eligibleSupplies = supplies.filter(isSupplyEligible)
  const eligibleDemands = demands.filter(isDemandEligible)

  const matches: CompatibilityMatch[] = []

  for (const supply of eligibleSupplies) {
    for (const demand of eligibleDemands) {
      const match = createMatch(supply, demand)

      if (match) {
        matches.push(match)
      }
    }
  }

  return matches.sort((a, b) => {
    const locationDifference =
      LOCATION_PRIORITY[a.breakdown.locationTier ?? 'unknown'] -
      LOCATION_PRIORITY[b.breakdown.locationTier ?? 'unknown']

    if (locationDifference !== 0) {
      return locationDifference
    }

    return (
      (b.overallScore ?? -1) -
      (a.overallScore ?? -1)
    )
  })
}
