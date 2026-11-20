import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Send,
  FileText,
  Truck,
  ShieldCheck,
  Handshake,
} from 'lucide-react'
import { CommodityMetricPill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { INQUIRY_THREADS } from '@/data/mock-data'
import type { InquiryThread, CoordinationMilestone } from '@/types/inquiry'

export function InquiriesCoordinationPage() {
  const [threads, setThreads] = useState<InquiryThread[]>(INQUIRY_THREADS)
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0].id)
  const [replyMessage, setReplyMessage] = useState('')

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0]

  const milestones: { key: CoordinationMilestone; label: string; icon: any }[] = [
    { key: 'inquiry_initiated', label: 'Inquiry Initiated', icon: Clock },
    { key: 'sample_tested', label: 'Sample Tested', icon: CheckCircle2 },
    { key: 'terms_proposed', label: 'Terms Proposed', icon: Handshake },
    { key: 'logistics_staged', label: 'Logistics Staged', icon: Truck },
    { key: 'contract_executed', label: 'Contract Executed', icon: FileText },
  ]

  const getMilestoneIndex = (m: CoordinationMilestone) => {
    return milestones.findIndex((item) => item.key === m)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: 'Musa Abdullahi',
      senderRole: 'Aggregator (You)',
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#143d2b]">
              Inquiries & Bilateral Coordination Desk
            </h1>
            <span className="rounded bg-[#ffdbca] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#331200]">
              Active Deal Pipeline
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Secure bilateral negotiation channel between producers, aggregators, and commercial off-takers with traceable audit logs and milestone verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-[#f8f9fa] px-3 py-2 rounded-xl border border-gray-200">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span>Encrypted Bilateral Channel</span>
        </div>
      </div>

      {/* Main Two-Pane Split: Threads List & Active Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Pane: Thread List (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Negotiations ({threads.length})
            </span>
            <span className="text-[11px] text-gray-400">Real-time</span>
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
                      ? 'border-[#143d2b] bg-[#f0fdf4] shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-gray-900 text-sm truncate">
                      {t.counterpartyOrg}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                      {t.lastActivity}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-0.5 truncate">{t.counterpartyName}</p>

                  <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="font-semibold text-[#143d2b] truncate">
                      {t.commoditySummary}
                    </span>
                    <span className="text-gray-500 font-bold tabular-nums shrink-0">
                      {t.quantitySummary}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Pane: Thread Detail & Messages (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#e5e7eb] bg-white shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Thread Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 bg-[#f8f9fa]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                    {activeThread.counterpartyOrg}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Processor
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Point of Contact: {activeThread.counterpartyName} ({activeThread.counterpartyRole})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <CommodityMetricPill
                  volume={activeThread.quantitySummary}
                  unit=""
                  spec={activeThread.commoditySummary}
                />
              </div>
            </div>

            {/* Stage Progress Bar (Milestones) */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Coordination Lifecycle Milestone
              </span>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {milestones.map((m, idx) => {
                  const currentIdx = getMilestoneIndex(activeThread.currentMilestone)
                  const isDone = idx <= currentIdx
                  const isCurrent = idx === currentIdx

                  return (
                    <div
                      key={m.key}
                      className={`p-2 rounded-lg border text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? 'border-[#143d2b] bg-[#143d2b] text-white'
                          : isDone
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 bg-white text-gray-400'
                      }`}
                    >
                      <span className="hidden sm:inline">{m.label}</span>
                      <span className="sm:hidden">{idx + 1}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[380px] bg-[#f9f9ff]">
            {activeThread.messages.map((msg) => {
              const isMe = msg.senderRole.includes('You')
              const isTermProposal = msg.type === 'terms'

              if (isTermProposal) {
                return (
                  <div
                    key={msg.id}
                    className="mx-auto max-w-md p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs"
                  >
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                      <Handshake className="h-4 w-4 text-amber-700" />
                      <span>Formal Commercial Term Proposal</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="text-xs py-1">
                        Accept Terms
                      </Button>
                      <Button size="sm" variant="secondary" className="text-xs py-1">
                        Counter Offer
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
                    <span className="text-xs font-bold text-gray-800">{msg.senderName}</span>
                    <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#143d2b] text-white rounded-br-xs'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reply Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 border-t border-gray-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Send response or specify dispatch logistics..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#143d2b] focus:outline-none"
            />
            <Button type="submit" size="sm" icon={<Send className="h-4 w-4" />}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
