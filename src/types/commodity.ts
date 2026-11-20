export type CommodityCategory =
  | 'Grains'
  | 'Legumes'
  | 'Roots & Tubers'
  | 'Cash Crops'
  | 'Fruits & Vegetables'

export interface CommodityGrade {
  code: string
  label: string
  description: string
  specifications: Record<string, string | number>
}

export interface Commodity {
  id: string
  name: string
  code: string
  category: CommodityCategory
  description: string
  varieties: string[]
  standardUnits: {
    unit: string
    kgConversion: number
  }[]
  maxMoistureContent?: number
  grades: CommodityGrade[]
  activeSupplyMT: number
  activeDemandMT: number
  seasonalPeak: string
  primaryProducingStates: string[]
}
