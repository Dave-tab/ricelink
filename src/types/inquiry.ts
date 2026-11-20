export type CoordinationMilestone =
  | 'inquiry_initiated'
  | 'sample_tested'
  | 'terms_proposed'
  | 'logistics_staged'
  | 'contract_executed'
  | 'completed'

export interface InquiryMessage {
  id: string
  senderName: string
  senderRole: string
  timestamp: string
  message: string
  type: 'chat' | 'milestone' | 'terms'
}

export interface InquiryThread {
  id: string
  threadCode: string
  supplyBatchId: string
  demandTenderId?: string
  counterpartyName: string
  counterpartyOrg: string
  counterpartyRole: string
  commoditySummary: string
  quantitySummary: string
  currentMilestone: CoordinationMilestone
  lastActivity: string
  unreadCount: number
  messages: InquiryMessage[]
}
