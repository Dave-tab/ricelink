import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Send,
  ShieldCheck,
  Handshake,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { INQUIRY_THREADS } from '@/data/mock-data'
import type { InquiryThread } from '@/types/inquiry'

export function InquiriesCoordinationPage() {
  const [searchParams] = useSearchParams()
  const [threads, setThreads] = useState<InquiryThread[]>(INQUIRY_THREADS)
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0].id)
  const [replyMessage, setReplyMessage] = useState('')
  const [acceptedOfferNotice, setAcceptedOfferNotice] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if routed with specific buyer or tender context
  useEffect(() => {
    const buyerParam = searchParams.get('buyer')
    const cropParam = searchParams.get('crop')

    if (buyerParam) {
      const existing = threads.find((t) =>
        t.counterpartyOrg.toLowerCase().includes(buyerParam.toLowerCase())
      )
      if (existing) {
        setActiveThreadId(existing.id)
      } else {
        // Create new dynamic thread with buyer
        const newThread: InquiryThread = {
          id: `inq-${Date.now()}`,
          threadCode: `INQ-${cropParam ? cropParam.slice(0, 3).toUpperCase() : 'CRP'}-2026-${Math.floor(100 + Math.random() * 900)}`,
          supplyBatchId: 'sb-001',
          counterpartyName: 'Procurement Desk',
          counterpartyOrg: buyerParam,
          counterpartyRole: 'Buyer',
          commoditySummary: cropParam || 'Produce Batch',
          quantitySummary: '50 MT',
          currentMilestone: 'inquiry_initiated',
          lastActivity: 'Just now',
          unreadCount: 0,
          messages: [
            {
              id: `msg-${Date.now()}`,
              senderName: buyerParam,
              senderRole: 'Buyer',
              timestamp: 'Just now',
              message: `Hello! We are looking to source ${cropParam || 'agricultural commodities'}. Please let us know your available quantity and delivery schedule.`,
              type: 'chat',
            },
          ],
        }
        setThreads([newThread, ...threads])
        setActiveThreadId(newThread.id)
      }
    }
  }, [searchParams])

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeThread.messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: 'Musa Abdullahi',
      senderRole: 'You (Aggregator)',
      timestamp: 'Just now',
      message: replyMessage,
      type: 'chat' as const,
    }

    const updatedThreads = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastActivity: 'Just now',
          messages: [...t.messages, newMsg],
        }
      }
      return t
    })

    setThreads(updatedThreads)
    setReplyMessage('')
  }

  const handleAcceptTerms = (offerMessage: string) => {
    const acceptanceMsg = {
      id: `msg-${Date.now()}`,
      senderName: 'Musa Abdullahi',
      senderRole: 'You (Aggregator)',
      timestamp: 'Just now',
      message: `✅ Commercial Terms Accepted: We agree to supply as stated in "${offerMessage}". Please prepare intake weighbridge at your factory gate.`,
      type: 'chat' as const,
    }

    const updatedThreads = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          currentMilestone: 'contract_executed' as const,
          lastActivity: 'Just now',
          messages: [...t.messages, acceptanceMsg],
        }
      }
      return t
    })

    setThreads(updatedThreads)
    setAcceptedOfferNotice(`Deal agreed with ${activeThread.counterpartyOrg}! Contract status updated to Confirmed.`)
    setTimeout(() => setAcceptedOfferNotice(null), 6000)
  }

  const handleCounterOffer = () => {
    setReplyMessage(
      `We reviewed your price offer. We can supply the full volume at ₦715,000 / Tonne with immediate dispatch from our Argungu depot. Kindly confirm if this works.`
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Messages & Deals
            </h1>
            <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-bold text-[#15803d]">
              Direct Buyer Negotiations
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Communicate directly with buyers, agree on prices per tonne, and coordinate delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-[#f8faf7] px-3.5 py-2 rounded-xl border border-gray-200">
          <ShieldCheck className="h-4 w-4 text-[#15803d]" />
          <span>Direct & Verified Channel</span>
        </div>
      </div>

      {/* Deal Acceptance Toast Banner */}
      {acceptedOfferNotice && (
        <div className="p-4 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] font-bold text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{acceptedOfferNotice}</span>
          </div>
          <button
            onClick={() => setAcceptedOfferNotice(null)}
            className="text-[#15803d] font-extrabold ml-3 hover:text-[#166534]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Two-Pane Messenger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Pane: Conversations List (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <span className="text-xs font-bold uppercase text-gray-500">
              Active Chats ({threads.length})
            </span>
            <span className="text-xs text-gray-400">Tap to open</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {threads.map((t) => {
              const isSelected = t.id === activeThreadId
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`cursor-pointer rounded-xl p-3.5 transition-all border ${
                    isSelected
                      ? 'border-[#15803d] bg-[#f0fdf4] shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-extrabold text-gray-900 text-sm truncate">
                      {t.counterpartyOrg}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                      {t.lastActivity}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-0.5 truncate">{t.counterpartyName}</p>

                  <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="font-bold text-[#15803d] truncate">
                      {t.commoditySummary}
                    </span>
                    <span className="text-gray-600 font-extrabold tabular-nums shrink-0">
                      {t.quantitySummary}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Pane: Chat Window & Deal Offer (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 bg-[#f8faf7]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                    {activeThread.counterpartyOrg}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#dcfce7] px-2 py-0.5 text-[11px] font-bold text-[#15803d]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Buyer
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Speaking with: {activeThread.counterpartyName} ({activeThread.counterpartyRole})
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#15803d]">
                {activeThread.quantitySummary} • {activeThread.commoditySummary}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[360px] bg-[#f9faf7]">
            {activeThread.messages.map((msg) => {
              const isMe = msg.senderRole.includes('You')
              const isTerms = msg.type === 'terms'

              if (isTerms) {
                return (
                  <div
                    key={msg.id}
                    className="mx-auto max-w-md p-4 rounded-2xl bg-[#fffbeb] border-2 border-[#fde68a] shadow-xs"
                  >
                    <div className="flex items-center gap-2 text-[#b45309] font-bold text-xs uppercase mb-1.5">
                      <Handshake className="h-4 w-4" />
                      <span>Formal Price Offer from Buyer</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[#15803d] hover:bg-[#166534] text-xs"
                        onClick={() => handleAcceptTerms(msg.message)}
                      >
                        Accept This Price
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                        onClick={handleCounterOffer}
                      >
                        Suggest Different Price
                      </Button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-extrabold text-gray-800">{msg.senderName}</span>
                    <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-[#15803d] text-white rounded-br-xs'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 border-t border-gray-200 bg-white flex items-center gap-2.5"
          >
            <input
              type="text"
              placeholder="Type your message or negotiate terms..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 p-3 text-xs font-medium focus:border-[#15803d] focus:outline-none"
            />
            <Button type="submit" size="md" icon={<Send className="h-4 w-4" />}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
