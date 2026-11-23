
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FileText,
  Handshake,
  MapPin,
  MessageCircle,
  MoreVertical,
  Package,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Truck,
  X,
} from 'lucide-react'

import { INQUIRY_THREADS } from '@/data/mock-data'
import type {
  Agreement,
  CommercialTerms,
  InquiryMessage,
  InquiryThread,
  NegotiationOffer,
} from '@/types/inquiry'

type OfferFormState = {
  commodityName: string
  variety: string
  grade: string
  quantity: string
  quantityUnit: string
  pricePerUnit: string
  deliveryLocation: string
  deliveryDate: string
  deliveryArrangement: string
  qualityRequirements: string
  additionalNotes: string
}

const EMPTY_OFFER: OfferFormState = {
  commodityName: '',
  variety: '',
  grade: '',
  quantity: '',
  quantityUnit: 'MT',
  pricePerUnit: '',
  deliveryLocation: '',
  deliveryDate: '',
  deliveryArrangement: '',
  qualityRequirements: '',
  additionalNotes: '',
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

const formatTime = (value: string) => {
  if (value.includes('AM') || value.includes('PM')) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const getLocalParticipant = (thread: InquiryThread) => {
  const ownMessage = thread.messages.find((message) =>
    message.senderRole.toLowerCase().includes('(you)'),
  )

  return ownMessage?.senderName ?? 'Current workspace'
}

const getLatestOffer = (thread: InquiryThread) =>
  [...(thread.offers ?? [])].sort(
    (a, b) => b.offerNumber - a.offerNumber,
  )[0]

const getOfferStatusLabel = (status: NegotiationOffer['status']) => {
  const labels: Record<NegotiationOffer['status'], string> = {
    pending: 'Awaiting response',
    accepted: 'Accepted',
    rejected: 'Declined',
    countered: 'Countered',
    withdrawn: 'Withdrawn',
    expired: 'Expired',
  }

  return labels[status]
}

const getConversationLabel = (thread: InquiryThread) => {
  if (thread.conversationStatus === 'agreement_reached') {
    return 'Agreement reached'
  }

  if (thread.conversationStatus === 'closed') return 'Closed'
  if (thread.conversationStatus === 'negotiating') return 'Negotiating'

  return 'Open enquiry'
}

const createOfferForm = (
  thread: InquiryThread,
  previousOffer?: NegotiationOffer,
): OfferFormState => {
  if (previousOffer) {
    return {
      commodityName: previousOffer.terms.commodityName,
      variety: previousOffer.terms.variety ?? '',
      grade: previousOffer.terms.grade ?? '',
      quantity: String(previousOffer.terms.quantity),
      quantityUnit: previousOffer.terms.quantityUnit,
      pricePerUnit: String(previousOffer.terms.pricePerUnit),
      deliveryLocation: previousOffer.terms.deliveryLocation,
      deliveryDate: previousOffer.terms.deliveryDate ?? '',
      deliveryArrangement: previousOffer.terms.deliveryArrangement ?? '',
      qualityRequirements: previousOffer.terms.qualityRequirements ?? '',
      additionalNotes: previousOffer.terms.additionalNotes ?? '',
    }
  }

  return {
    ...EMPTY_OFFER,
    commodityName: thread.commoditySummary,
    quantity: thread.quantitySummary.match(/[\d.]+/)?.[0] ?? '',
  }
}

const createTerms = (form: OfferFormState): CommercialTerms => ({
  commodityName: form.commodityName.trim(),
  variety: form.variety.trim() || undefined,
  grade: form.grade.trim() || undefined,
  quantity: Number(form.quantity),
  quantityUnit: form.quantityUnit.trim(),
  pricePerUnit: Number(form.pricePerUnit),
  currency: 'NGN',
  deliveryLocation: form.deliveryLocation.trim(),
  deliveryDate: form.deliveryDate || undefined,
  deliveryArrangement: form.deliveryArrangement.trim() || undefined,
  qualityRequirements: form.qualityRequirements.trim() || undefined,
  additionalNotes: form.additionalNotes.trim() || undefined,
})

function OfferCard({
  offer,
  onAccept,
  onReject,
  onCounter,
  canRespond,
}: {
  offer: NegotiationOffer
  onAccept: () => void
  onReject: () => void
  onCounter: () => void
  canRespond: boolean
}) {
  const { terms } = offer

  return (
    <div className="my-3 max-w-xl overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <Handshake className="h-4 w-4 text-emerald-700" />
          <span className="text-sm font-semibold text-slate-800">
            Commercial offer #{offer.offerNumber}
          </span>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            offer.status === 'accepted'
              ? 'bg-emerald-100 text-emerald-800'
              : offer.status === 'pending'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-600'
          }`}
        >
          {getOfferStatusLabel(offer.status)}
        </span>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="text-base font-semibold text-slate-900">
            {terms.commodityName}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {terms.variety || 'Variety not specified'}
            {terms.grade ? ` · ${terms.grade}` : ''}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Quantity</p>
            <p className="mt-1 font-semibold text-slate-900">
              {terms.quantity.toLocaleString()} {terms.quantityUnit}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Price per {terms.quantityUnit}</p>
            <p className="mt-1 font-semibold text-slate-900">
              {formatCurrency(terms.pricePerUnit)}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span>{terms.deliveryLocation}</span>
          </div>

          {terms.deliveryDate && (
            <div className="flex items-start gap-2 text-slate-600">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>Proposed delivery: {terms.deliveryDate}</span>
            </div>
          )}

          {terms.deliveryArrangement && (
            <p className="text-slate-600">
              <span className="font-medium text-slate-700">Arrangement:</span>{' '}
              {terms.deliveryArrangement}
            </p>
          )}

          {terms.qualityRequirements && (
            <p className="text-slate-600">
              <span className="font-medium text-slate-700">Quality:</span>{' '}
              {terms.qualityRequirements}
            </p>
          )}

          {terms.additionalNotes && (
            <p className="text-slate-600">
              <span className="font-medium text-slate-700">Notes:</span>{' '}
              {terms.additionalNotes}
            </p>
          )}
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">
            Proposed by {offer.proposedBy} · {offer.createdAt}
          </p>
        </div>

        {canRespond && offer.status === 'pending' && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onAccept}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" />
              Accept offer
            </button>
            <button
              type="button"
              onClick={onCounter}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Counteroffer
            </button>
            <button
              type="button"
              onClick={onReject}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AgreementCard({ agreement }: { agreement: Agreement }) {
  return (
    <div className="my-3 max-w-xl overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-emerald-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">
            Agreement reached
          </p>
          <p className="text-xs text-emerald-700">
            {agreement.agreementReference}
          </p>
        </div>
      </div>
      <div className="space-y-2 p-4 text-sm">
        <p className="font-semibold text-slate-900">
          {agreement.terms.commodityName}
        </p>
        <p className="text-slate-600">
          {agreement.terms.quantity.toLocaleString()} {agreement.terms.quantityUnit}
          {' '}at {formatCurrency(agreement.terms.pricePerUnit)} per{' '}
          {agreement.terms.quantityUnit}
        </p>
        <p className="text-slate-600">
          Delivery location: {agreement.terms.deliveryLocation}
        </p>
        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">
            Accepted by: {agreement.acceptedBy.join(' and ')}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Agreement recorded: {agreement.agreedAt}
          </p>
        </div>
      </div>
    </div>
  )
}

export function InquiriesCoordinationPage() {
  const [threads, setThreads] = useState<InquiryThread[]>(() =>
    INQUIRY_THREADS.map((thread) => ({ ...thread })),
  )
  const [activeThreadId, setActiveThreadId] = useState(
    INQUIRY_THREADS[0]?.id ?? '',
  )
  const [search, setSearch] = useState('')
  const [messageText, setMessageText] = useState('')
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerForm, setOfferForm] = useState<OfferFormState>(EMPTY_OFFER)
  const [offerFormError, setOfferFormError] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [mobileView, setMobileView] = useState<'inbox' | 'chat'>('inbox')

  const activeThread = threads.find((thread) => thread.id === activeThreadId)

  const filteredThreads = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return threads

    return threads.filter((thread) =>
      [
        thread.counterpartyName,
        thread.counterpartyOrg,
        thread.commoditySummary,
        thread.threadCode,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [threads, search])

  const updateThread = (
    threadId: string,
    updater: (thread: InquiryThread) => InquiryThread,
  ) => {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? updater(thread) : thread,
      ),
    )
  }

  const addMessage = (
    thread: InquiryThread,
    message: InquiryMessage,
  ): InquiryThread => ({
    ...thread,
    messages: [...thread.messages, message],
    lastActivity: message.timestamp,
    unreadCount: 0,
  })

  const selectThread = (threadId: string) => {
    setActiveThreadId(threadId)
    setMobileView('chat')
    updateThread(threadId, (thread) => ({ ...thread, unreadCount: 0 }))
    setShowOfferForm(false)
  }

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!activeThread || !messageText.trim()) return

    const localName = getLocalParticipant(activeThread)
    const message: InquiryMessage = {
      id: `local-message-${Date.now()}`,
      senderName: localName,
      senderRole: 'Participant (You)',
      timestamp: new Date().toISOString(),
      message: messageText.trim(),
      type: 'chat',
    }

    updateThread(activeThread.id, (thread) => addMessage(thread, message))
    setMessageText('')
  }

  const openOfferForm = (counteroffer = false) => {
    if (!activeThread) return

    const latestOffer = getLatestOffer(activeThread)

    setOfferForm(createOfferForm(activeThread, counteroffer ? latestOffer : undefined))
    setOfferFormError('')
    setShowOfferForm(true)
  }

  const handleSubmitOffer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!activeThread) return

    const quantity = Number(offerForm.quantity)
    const price = Number(offerForm.pricePerUnit)

    if (
      !offerForm.commodityName.trim() ||
      !offerForm.quantityUnit.trim() ||
      !offerForm.deliveryLocation.trim() ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setOfferFormError(
        'Enter a commodity, valid quantity, price and delivery location.',
      )
      return
    }

    const previousOffer = getLatestOffer(activeThread)
    const localName = getLocalParticipant(activeThread)
    const nextNumber =
      Math.max(0, ...(activeThread.offers ?? []).map((offer) => offer.offerNumber)) + 1
    const now = new Date().toISOString()

    const newOffer: NegotiationOffer = {
      id: `local-offer-${Date.now()}`,
      offerNumber: nextNumber,
      proposedBy: localName,
      proposedByRole: 'Participant',
      createdAt: formatTime(now),
      status: 'pending',
      terms: createTerms(offerForm),
      previousOfferId: showOfferForm && previousOffer
        ? previousOffer.id
        : undefined,
    }

    updateThread(activeThread.id, (thread) => {
      const existingOffers = (thread.offers ?? []).map((offer) =>
        offer.status === 'pending'
          ? { ...offer, status: 'countered' as const }
          : offer,
      )

      const updated = {
        ...thread,
        offers: [...existingOffers, newOffer],
        conversationStatus: 'negotiating' as const,
      }

      return addMessage(updated, {
        id: `local-offer-message-${Date.now()}`,
        senderName: localName,
        senderRole: 'Participant (You)',
        timestamp: now,
        message: `Submitted commercial offer #${nextNumber}.`,
        type: 'offer',
        offerId: newOffer.id,
      })
    })

    setShowOfferForm(false)
    setOfferForm(EMPTY_OFFER)
    setOfferFormError('')
  }

  const handleAcceptOffer = (offer: NegotiationOffer) => {
    if (!activeThread) return

    const localName = getLocalParticipant(activeThread)
    const now = new Date().toISOString()

    const agreement: Agreement = {
      id: `local-agreement-${Date.now()}`,
      acceptedOfferId: offer.id,
      terms: offer.terms,
      acceptedBy: [offer.proposedBy, localName],
      agreedAt: formatTime(now),
      agreementReference: `RL-${Date.now().toString().slice(-8)}`,
    }

    updateThread(activeThread.id, (thread) => {
      const updated: InquiryThread = {
        ...thread,
        offers: (thread.offers ?? []).map((item) => ({
          ...item,
          status: item.id === offer.id ? 'accepted' : item.status,
        })),
        agreement,
        conversationStatus: 'agreement_reached',
        paymentStatus: 'not_initiated',
        deliveryStatus: 'not_started',
      }

      return addMessage(updated, {
        id: `local-agreement-message-${Date.now()}`,
        senderName: 'RiceLink workspace',
        senderRole: 'System',
        timestamp: now,
        message: 'The offer was accepted in this demo workspace. An agreement summary has been created.',
        type: 'system',
      })
    })
  }

  const handleRejectOffer = (offer: NegotiationOffer) => {
    if (!activeThread) return

    const now = new Date().toISOString()

    updateThread(activeThread.id, (thread) => {
      const updated: InquiryThread = {
        ...thread,
        offers: (thread.offers ?? []).map((item) =>
          item.id === offer.id ? { ...item, status: 'rejected' } : item,
        ),
      }

      return addMessage(updated, {
        id: `local-rejection-${Date.now()}`,
        senderName: 'RiceLink workspace',
        senderRole: 'System',
        timestamp: now,
        message: `Offer #${offer.offerNumber} was declined in this demo workspace.`,
        type: 'system',
      })
    })
  }

  const renderMessageContent = (message: InquiryMessage) => {
    if (message.type === 'offer' && message.offerId && activeThread) {
      const offer = activeThread.offers?.find(
        (item) => item.id === message.offerId,
      )

      if (offer) {
        const isOwnMessage = message.senderRole.toLowerCase().includes('(you)')

        return (
          <OfferCard
            offer={offer}
            canRespond={!isOwnMessage && !activeThread.agreement}
            onAccept={() => handleAcceptOffer(offer)}
            onReject={() => handleRejectOffer(offer)}
            onCounter={() => openOfferForm(true)}
          />
        )
      }
    }

    if (message.type === 'system') {
      return (
        <div className="mx-auto my-3 max-w-md rounded-lg bg-slate-100 px-4 py-2 text-center text-xs text-slate-500">
          {message.message}
        </div>
      )
    }

    const isOwnMessage = message.senderRole.toLowerCase().includes('(you)')

    return (
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
          isOwnMessage
            ? 'ml-auto rounded-br-sm bg-emerald-100 text-slate-800'
            : 'mr-auto rounded-bl-sm border border-slate-100 bg-white text-slate-800'
        }`}
      >
        {!isOwnMessage && (
          <p className="mb-1 text-xs font-semibold text-emerald-700">
            {message.senderName}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.message}
        </p>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
          {formatTime(message.timestamp)}
          {isOwnMessage && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    )
  }

  if (!threads.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          No conversations yet
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enquiries and conversations will appear here when they are created.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Messages
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discuss supply, negotiate commercial terms and keep agreements organised.
            </p>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
            Demo
          </span>
        </div>
      </div>

      <div className="grid min-h-[680px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        <aside
          className={`flex min-h-[680px] flex-col border-r border-slate-200 ${
            mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Conversations</h2>
              <span className="text-xs text-slate-400">
                {threads.length} total
              </span>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => {
              const lastMessage = thread.messages[thread.messages.length - 1]
              const isActive = thread.id === activeThreadId

              return (
                <button
                  type="button"
                  key={thread.id}
                  onClick={() => selectThread(thread.id)}
                  className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                    isActive ? 'bg-emerald-50/70' : 'bg-white'
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                    {getInitials(thread.counterpartyOrg)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {thread.counterpartyOrg}
                      </p>
                      <span className="shrink-0 text-[10px] text-slate-400">
                        {formatTime(thread.lastActivity)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {lastMessage?.message ?? thread.commoditySummary}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] text-slate-500">
                        {thread.commoditySummary}
                      </span>
                      {thread.unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-semibold text-white">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {getConversationLabel(thread)}
                    </p>
                  </div>
                </button>
              )
            })}

            {filteredThreads.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-400">
                No conversations match your search.
              </p>
            )}
          </div>
        </aside>

        <main
          className={`flex min-w-0 flex-col bg-slate-50 ${
            mobileView === 'inbox' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {activeThread ? (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileView('inbox')}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                    {getInitials(activeThread.counterpartyOrg)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                      {activeThread.counterpartyOrg}
                    </h2>
                    <p className="truncate text-xs text-slate-500">
                      {activeThread.counterpartyRole} · {activeThread.threadCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowDetails((value) => !value)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 xl:hidden"
                    aria-label="Toggle transaction details"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 sm:block"
                    aria-label="More conversation options"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </header>

              <div className="border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-emerald-700" />
                    <span className="font-medium text-slate-800">
                      {activeThread.commoditySummary}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">
                      {activeThread.quantitySummary}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {getConversationLabel(activeThread)}
                  </span>
                </div>
              </div>

              {showDetails && (
                <div className="border-b border-slate-200 bg-white p-4 xl:hidden">
                  <TransactionDetails thread={activeThread} />
                </div>
              )}

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                <div className="mx-auto mb-5 max-w-sm rounded-lg bg-white/80 px-4 py-3 text-center text-xs leading-5 text-slate-500 shadow-sm">
                  This conversation is for coordinating the enquiry and
                  discussing commercial terms. Confirm important details before
                  reaching an agreement.
                </div>

                {activeThread.messages.map((message) => (
                  <div key={message.id}>
                    {renderMessageContent(message)}
                  </div>
                ))}

                {activeThread.agreement && (
                  <AgreementCard agreement={activeThread.agreement} />
                )}
              </div>

              {showOfferForm && (
                <form
                  onSubmit={handleSubmitOffer}
                  className="border-t border-slate-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {activeThread.offers?.length
                          ? 'Make a counteroffer'
                          : 'Create an offer'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Enter the commercial terms you want to propose.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOfferForm(false)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      aria-label="Close offer form"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Commodity">
                      <input
                        required
                        value={offerForm.commodityName}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, commodityName: event.target.value })
                        }
                        className="form-input"
                        placeholder="Commodity name"
                      />
                    </FormField>
                    <FormField label="Variety (optional)">
                      <input
                        value={offerForm.variety}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, variety: event.target.value })
                        }
                        className="form-input"
                        placeholder="Variety"
                      />
                    </FormField>
                    <FormField label="Quantity">
                      <div className="flex gap-2">
                        <input
                          required
                          type="number"
                          min="0.01"
                          step="any"
                          value={offerForm.quantity}
                          onChange={(event) =>
                            setOfferForm({ ...offerForm, quantity: event.target.value })
                          }
                          className="form-input min-w-0 flex-1"
                          placeholder="Quantity"
                        />
                        <input
                          required
                          value={offerForm.quantityUnit}
                          onChange={(event) =>
                            setOfferForm({ ...offerForm, quantityUnit: event.target.value })
                          }
                          className="form-input w-20"
                          aria-label="Quantity unit"
                        />
                      </div>
                    </FormField>
                    <FormField label="Price per unit (₦)">
                      <input
                        required
                        type="number"
                        min="1"
                        step="any"
                        value={offerForm.pricePerUnit}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, pricePerUnit: event.target.value })
                        }
                        className="form-input"
                        placeholder="e.g. 700000"
                      />
                    </FormField>
                    <FormField label="Grade (optional)">
                      <input
                        value={offerForm.grade}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, grade: event.target.value })
                        }
                        className="form-input"
                        placeholder="Grade or quality class"
                      />
                    </FormField>
                    <FormField label="Delivery location">
                      <input
                        required
                        value={offerForm.deliveryLocation}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, deliveryLocation: event.target.value })
                        }
                        className="form-input"
                        placeholder="Town, state or facility"
                      />
                    </FormField>
                    <FormField label="Proposed delivery date (optional)">
                      <input
                        type="date"
                        value={offerForm.deliveryDate}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, deliveryDate: event.target.value })
                        }
                        className="form-input"
                      />
                    </FormField>
                    <FormField label="Delivery arrangement (optional)">
                      <input
                        value={offerForm.deliveryArrangement}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, deliveryArrangement: event.target.value })
                        }
                        className="form-input"
                        placeholder="e.g. Delivered by supplier"
                      />
                    </FormField>
                    <FormField label="Quality requirements (optional)">
                      <textarea
                        value={offerForm.qualityRequirements}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, qualityRequirements: event.target.value })
                        }
                        className="form-input min-h-16"
                        placeholder="Moisture, grade, inspection requirements..."
                      />
                    </FormField>
                    <FormField label="Additional notes (optional)">
                      <textarea
                        value={offerForm.additionalNotes}
                        onChange={(event) =>
                          setOfferForm({ ...offerForm, additionalNotes: event.target.value })
                        }
                        className="form-input min-h-16"
                        placeholder="Other terms..."
                      />
                    </FormField>
                  </div>

                  {offerFormError && (
                    <p className="mt-3 text-xs text-red-600">{offerFormError}</p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOfferForm(false)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Submit offer
                    </button>
                  </div>
                </form>
              )}

              <div className="border-t border-slate-200 bg-white p-3">
                {activeThread.agreement ? (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p>
                      Agreement reached. Further payment and delivery
                      coordination can be handled as those features become available.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openOfferForm(false)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Make an offer
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDetails((value) => !value)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 xl:hidden"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Transaction details
                      </button>
                    </div>
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                      <textarea
                        value={messageText}
                        onChange={(event) => setMessageText(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault()
                            event.currentTarget.form?.requestSubmit()
                          }
                        }}
                        rows={1}
                        placeholder="Write a message..."
                        className="max-h-28 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <MessageCircle className="h-12 w-12 text-slate-300" />
              <h2 className="mt-4 font-semibold text-slate-800">
                Select a conversation
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose an enquiry from the inbox to view its messages.
              </p>
            </div>
          )}
        </main>

        <aside className="hidden border-l border-slate-200 bg-white p-4 xl:block">
          {activeThread ? (
            <TransactionDetails thread={activeThread} />
          ) : (
            <p className="text-sm text-slate-400">Transaction details will appear here.</p>
          )}
        </aside>
      </div>

      <style>{`
        .form-input {
          display: block;
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.8125rem;
          color: #1e293b;
          outline: none;
        }
        .form-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgb(16 185 129 / 10%);
        }
      `}</style>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  )
}

function TransactionDetails({ thread }: { thread: InquiryThread }) {
  const latestOffer = getLatestOffer(thread)

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-700" />
          <h3 className="font-semibold text-slate-900">Transaction details</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Enquiry {thread.threadCode}
        </p>
      </div>

      <div className="space-y-3">
        <DetailItem label="Counterparty" value={thread.counterpartyOrg} />
        <DetailItem label="Contact" value={thread.counterpartyName} />
        <DetailItem label="Participant role" value={thread.counterpartyRole} />
        <DetailItem label="Commodity" value={thread.commoditySummary} />
        <DetailItem label="Quantity" value={thread.quantitySummary} />
        <DetailItem label="Conversation" value={getConversationLabel(thread)} />
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Negotiation
        </h4>
        {latestOffer ? (
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              Latest offer #{latestOffer.offerNumber}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatCurrency(latestOffer.terms.pricePerUnit)} /{' '}
              {latestOffer.terms.quantityUnit}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {latestOffer.terms.quantity.toLocaleString()}{' '}
              {latestOffer.terms.quantityUnit}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-600">
              {getOfferStatusLabel(latestOffer.status)}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            No commercial offer has been submitted yet.
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Agreement
        </h4>
        {thread.agreement ? (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Agreement reached
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                {thread.agreement.agreementReference}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            An agreement summary will appear here when an offer is accepted.
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Fulfilment status
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-700">Payment</p>
              <p className="text-xs text-slate-500">
                {thread.paymentStatus === 'paid'
                  ? 'Paid'
                  : thread.paymentStatus === 'awaiting_payment'
                    ? 'Awaiting payment'
                    : thread.paymentStatus === 'payment_pending'
                      ? 'Payment pending'
                      : thread.paymentStatus === 'refunded'
                        ? 'Refunded'
                        : thread.paymentStatus === 'disputed'
                          ? 'Disputed'
                          : 'Not initiated'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-700">Delivery</p>
              <p className="text-xs text-slate-500">
                {thread.deliveryStatus
                  ? thread.deliveryStatus.replaceAll('_', ' ')
                  : 'Not started'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" />
          <p className="text-xs font-semibold text-amber-900">
            Escrow is not available yet
          </p>
        </div>
        <p className="mt-2 text-xs leading-5 text-amber-800">
          RiceLink does not currently collect, hold or transfer funds. Payment
          and escrow services will require a future payment integration.
        </p>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  )
}
