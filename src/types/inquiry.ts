
export type CoordinationMilestone =
  | 'inquiry_initiated'
  | 'sample_tested'
  | 'terms_proposed'
  | 'logistics_staged'
  | 'contract_executed'
  | 'completed'

export type ConversationStatus =
  | 'open'
  | 'negotiating'
  | 'agreement_reached'
  | 'closed'

export type InquiryMessageType =
  | 'chat'
  | 'milestone'
  | 'terms'
  | 'offer'
  | 'system'
  | 'attachment'

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'countered'
  | 'withdrawn'
  | 'expired'

export type PaymentStatus =
  | 'not_applicable'
  | 'not_initiated'
  | 'awaiting_payment'
  | 'payment_pending'
  | 'paid'
  | 'refunded'
  | 'disputed'

export type DeliveryStatus =
  | 'not_started'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'received'
  | 'disputed'

export interface CommercialTerms {
  commodityName: string
  variety?: string
  grade?: string
  quantity: number
  quantityUnit: string
  pricePerUnit: number
  currency: 'NGN'
  deliveryLocation: string
  deliveryDate?: string
  deliveryArrangement?: string
  qualityRequirements?: string
  additionalNotes?: string
}

export interface NegotiationOffer {
  id: string
  offerNumber: number
  proposedBy: string
  proposedByRole: string
  createdAt: string
  expiresAt?: string
  status: OfferStatus
  terms: CommercialTerms
  responseNote?: string
  previousOfferId?: string
}

export interface Agreement {
  id: string
  acceptedOfferId: string
  terms: CommercialTerms
  acceptedBy: string[]
  agreedAt: string
  agreementReference: string
}

export interface InquiryAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize?: number
  url?: string
}

export interface InquiryMessage {
  id: string
  senderName: string
  senderRole: string
  timestamp: string
  message: string
  type: InquiryMessageType
  offerId?: string
  attachment?: InquiryAttachment
}

export interface InquiryThread {
  id: string
  threadCode: string

  // Related marketplace records
  supplyBatchId: string
  demandTenderId?: string

  // Conversation participants
  counterpartyName: string
  counterpartyOrg: string
  counterpartyRole: string

  // Transaction context
  commoditySummary: string
  quantitySummary: string

  // Conversation state
  currentMilestone: CoordinationMilestone
  conversationStatus?: ConversationStatus
  lastActivity: string
  unreadCount: number

  // Negotiation records
  offers?: NegotiationOffer[]
  agreement?: Agreement

  // Future transaction tracking
  paymentStatus?: PaymentStatus
  deliveryStatus?: DeliveryStatus

  // Conversation history
  messages: InquiryMessage[]
}
