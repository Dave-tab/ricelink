
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Sprout,
  ArrowRight,
  ArrowUpRight,
  Wheat,
  Package,
  ShoppingBasket,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Boxes,
  Handshake,
  Search,
  Leaf,
  ChevronRight,
  Truck,
  Warehouse,
  ShieldCheck,
  CircleHelp,
  BookOpen,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const participants = [
  {
    icon: Sprout,
    title: 'Farmers and producer groups',
    description:
      'Share available produce and give potential buyers the information they need to understand what you have.',
  },
  {
    icon: Boxes,
    title: 'Aggregators and cooperatives',
    description:
      'Coordinate produce from different farmers and communicate collective supply availability.',
  },
  {
    icon: Wheat,
    title: 'Processors and millers',
    description:
      'Communicate sourcing requirements and discover agricultural produce that fits your processing needs.',
  },
  {
    icon: ShoppingBasket,
    title: 'Buyers and distributors',
    description:
      'Discover available produce, review supply details and connect with potential suppliers.',
  },
  {
    icon: Warehouse,
    title: 'Storage providers',
    description:
      'Make storage services discoverable to agricultural participants who need storage support.',
  },
  {
    icon: Truck,
    title: 'Logistics operators',
    description:
      'Connect with participants who need to coordinate the movement of agricultural produce.',
  },
]

const steps = [
  {
    number: '01',
    icon: Package,
    title: 'Share what is available',
    description:
      'Provide details about your crop, variety, quantity, measurement unit, quality and location.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Explore supply and demand',
    description:
      'Discover available produce or find procurement requirements that match what you are looking for.',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Connect and discuss',
    description:
      'Make an enquiry and communicate about quantity, quality, pricing and delivery arrangements.',
  },
]

const crops = [
  {
    name: 'Rice',
    emoji: '🌾',
    category: 'Cereal crop',
    description:
      'Connect with producers and buyers dealing in paddy rice and processed rice.',
  },
  {
    name: 'Maize',
    emoji: '🌽',
    category: 'Cereal crop',
    description:
      'Discover maize supply and sourcing requirements for food and feed production.',
  },
  {
    name: 'Cassava',
    emoji: '🥔',
    category: 'Root crop',
    description:
      'Explore cassava supply for processing, food production and other uses.',
  },
  {
    name: 'Sorghum',
    emoji: '🌾',
    category: 'Cereal crop',
    description:
      'Connect around sorghum supply for food, beverages and industrial processing.',
  },
  {
    name: 'Soybeans',
    emoji: '🫘',
    category: 'Oilseed crop',
    description:
      'Discover soybean supply for food processing, oil production and animal feed.',
  },
  {
    name: 'Yam',
    emoji: '🍠',
    category: 'Root crop',
    description:
      'Find opportunities involving yam producers, traders and commercial buyers.',
  },
  {
    name: 'Cowpea',
    emoji: '🫘',
    category: 'Legume',
    description:
      'Explore cowpea supply and demand for food markets and agricultural trade.',
  },
  {
    name: 'Groundnut',
    emoji: '🥜',
    category: 'Oilseed crop',
    description:
      'Connect with participants dealing in groundnut for food and processing.',
  },
]

const faqs = [
  {
    question: 'What is RiceLink?',
    answer:
      'RiceLink is a multi-crop agricultural supply-chain coordination platform designed to connect farmers, aggregators, cooperatives, processors, buyers and other agricultural participants. It provides a place to discover supply, communicate sourcing needs and coordinate potential business opportunities.',
  },
  {
    question: 'Who can use RiceLink?',
    answer:
      'RiceLink is designed for farmers, producer groups, aggregators, cooperatives, processors, commercial buyers, distributors, storage providers and logistics operators.',
  },
  {
    question: 'Does RiceLink support crops beyond rice?',
    answer:
      'Yes. RiceLink is designed as a multi-crop platform. Supported examples include rice, maize, cassava, sorghum, soybeans, yam, cowpea and groundnut. Other agricultural commodities can also be accommodated.',
  },
  {
    question: 'Can individuals and organisations register?',
    answer:
      'Yes. RiceLink supports both individual and organisation accounts. Participants can select the roles relevant to their activities. A person may also participate individually and represent an organisation.',
  },
  {
    question: 'Do I need to verify my account?',
    answer:
      'Verification is part of the platform trust process. Depending on your account and activities, you may be asked to provide contact, identity or organisation information. Submitted evidence must be reviewed before approval. Verification requirements and available evidence routes may differ for individuals and organisations.',
  },
  {
    question: 'How do buyers connect with suppliers?',
    answer:
      'Buyers can explore available supply, review listing details and initiate enquiries. Both parties can then discuss quantities, quality requirements, pricing and delivery arrangements before deciding whether to proceed.',
  },
  {
    question: 'Can I publish a supply listing or buyer request?',
    answer:
      'RiceLink is designed to support separate supply and demand listings. Supply listings describe produce available for sale, while demand listings communicate what a buyer or processor is looking to source. Trading access is subject to the platform verification requirements.',
  },
  {
    question: 'How does matching work?',
    answer:
      'Matching compares relevant information such as crop, quantity, quality, location and delivery requirements. A match is an indication of potential compatibility, not a confirmed deal, guaranteed supply or assurance that both parties will agree.',
  },
  {
    question: 'Does RiceLink handle payments or escrow?',
    answer:
      'RiceLink does not currently collect, hold or transfer funds. Payment processing and escrow are not available through the platform. Participants should agree on and arrange payment directly.',
  },
  {
    question: 'Does RiceLink guarantee produce quality or delivery?',
    answer:
      'No. RiceLink helps participants discover opportunities and communicate. Participants remain responsible for independently checking produce quality, confirming availability, agreeing on terms and making their own delivery arrangements.',
  },
  {
    question: 'Are the listings and matching results live?',
    answer:
      'Some information currently displayed in the frontend may be illustrative or sample data. It should not be interpreted as confirmed transactions, actual inventory or verified availability.',
  },
  {
    question: 'Do I need to know the exact crop variety before listing?',
    answer:
      'No. You can provide the crop name even when you do not know its exact variety. Variety information can be added when available, but it should not be guessed or invented.',
  },
]

export function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(
    faqs[0]?.question ?? null,
  )

  return (
    <div className="overflow-hidden bg-white text-gray-900">
      {/* Hero */}
      <section
        id="home"
        className="relative isolate scroll-mt-24 overflow-hidden bg-[#f5f9f3]"
      >
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[440px] w-[440px] rounded-full bg-[#dcebd8] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-[-120px] -z-10 h-[380px] w-[380px] rounded-full bg-[#e9f0d9] blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex animate-[fade-up_650ms_ease-out_both] items-center gap-2 rounded-full border border-[#d8e7d4] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#28613a]">
              <Sprout className="h-4 w-4" />
              Connecting the agricultural supply chain
            </div>

            <h1 className="mt-7 animate-[fade-up_750ms_ease-out_100ms_both] text-4xl font-bold leading-[1.12] tracking-[-0.045em] text-[#183321] sm:text-5xl lg:text-[3.7rem]">
              Connecting the people behind the food we grow.
            </h1>

            <p className="mt-6 max-w-xl animate-[fade-up_750ms_ease-out_200ms_both] text-base leading-8 text-[#58695c] sm:text-lg">
              RiceLink brings farmers, aggregators, processors and buyers
              together to discover agricultural supply, communicate their
              needs and coordinate opportunities.
            </p>

            <div className="mt-8 flex animate-[fade-up_750ms_ease-out_300ms_both] flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="h-5 w-5" />}
                >
                  Get started
                </Button>
              </Link>

              <Link to="/commodities">
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  icon={<ArrowUpRight className="h-5 w-5" />}
                >
                  Explore commodities
                </Button>
              </Link>
            </div>

            <div className="mt-9 flex animate-[fade-up_750ms_ease-out_400ms_both] flex-wrap gap-x-6 gap-y-3 text-sm text-[#536657]">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#36834b]" />
                Multiple crop categories
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#36834b]" />
                Supply and demand discovery
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#36834b]" />
                Direct communication
              </span>
            </div>
          </div>

          {/* Illustrative workflow */}
          <div className="relative mx-auto w-full max-w-[540px] animate-[fade-up_900ms_ease-out_200ms_both]">
            <div className="pointer-events-none absolute -inset-5 animate-[soft-pulse_7s_ease-in-out_infinite] rounded-[2rem] bg-[#dcebd8]/70 blur-2xl" />

            <div className="relative animate-[float-gentle_6s_ease-in-out_infinite] rounded-3xl border border-[#e0e9dd] bg-white p-5 shadow-[0_24px_70px_-35px_rgba(25,65,35,0.4)] sm:p-7">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7c907e]">
                    The RiceLink connection
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[#203c28]">
                    From farm to opportunity
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4e7] text-[#327343]">
                  <Leaf className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-[#e6ede3] bg-[#fbfdf9] p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f1e1] text-[#347445]">
                    <Sprout className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#29432f]">
                      Producer
                    </p>
                    <p className="text-xs text-[#7b897d]">
                      Has agricultural produce available
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#849185]">Crop</p>
                    <p className="mt-1 text-sm font-semibold text-[#344a38]">
                      Paddy rice
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#849185]">Supply details</p>
                    <p className="mt-1 text-sm font-semibold text-[#344a38]">
                      Quantity and quality
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#849185]">Location</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[#526456]">
                      <MapPin className="h-3.5 w-3.5" />
                      Where it is available
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#849185]">Availability</p>
                    <p className="mt-1 text-sm font-semibold text-[#344a38]">
                      Supply information
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 py-4">
                <span className="h-px flex-1 bg-[#e5ebe2]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a998b]">
                  Discover and connect
                </span>
                <span className="h-px flex-1 bg-[#e5ebe2]" />
              </div>

              <div className="rounded-2xl border border-[#eee7d8] bg-[#fffdf8] p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0d9] text-[#a66b20]">
                    <ShoppingBasket className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#4b3a24]">
                      Buyer or processor
                    </p>
                    <p className="text-xs text-[#93816b]">
                      Has a sourcing requirement
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#93816b]">Looking for</p>
                    <p className="mt-1 text-sm font-semibold text-[#55432c]">
                      Agricultural produce
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eddfc7] bg-white px-3 py-2 text-xs font-semibold text-[#89612e]">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Make an enquiry
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f1f6ef] p-4">
                <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-[#397849]" />
                <p className="text-xs leading-6 text-[#586b5b]">
                  Both parties can discuss the details and work towards
                  agreeing on the next steps.
                </p>
              </div>

              <p className="mt-3 text-center text-[10px] text-[#9aa59b]">
                Illustrative workflow — not a live transaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Crops and commodities */}
      <section id="crops" className="scroll-mt-24 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6e896f]">
                Explore our crop categories
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#203628] sm:text-4xl">
                More than rice. A platform for multiple crops.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#667469]">
                Agricultural trade involves different crops, producers and
                buyers. RiceLink is designed to support discovery across a
                growing range of agricultural commodities.
              </p>
            </div>

            <Link
              to="/commodities"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#28713d] transition-colors hover:text-[#17432a]"
            >
              Explore full catalogue
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {crops.map((crop, index) => (
              <article
                key={crop.name}
                style={{ animationDelay: `${index * 70}ms` }}
                className="group animate-[fade-up_600ms_ease-out_both] overflow-hidden rounded-2xl border border-[#e6ece3] bg-[#fcfdfb] transition-all duration-300 hover:-translate-y-1 hover:border-[#c7d9c3] hover:shadow-[0_16px_35px_-20px_rgba(25,65,35,0.3)]"
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-[#edf5e9] via-[#f7faf4] to-[#e5efdf] transition-colors duration-300 group-hover:from-[#e2f0dc] group-hover:to-[#dcebd8]">
                  <span
                    role="img"
                    aria-label={crop.name}
                    className="text-6xl transition-transform duration-300 group-hover:scale-110"
                  >
                    {crop.emoji}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-[#29402e]">
                      {crop.name}
                    </h3>
                    <span className="rounded-full bg-[#edf5e9] px-2.5 py-1 text-[10px] font-semibold text-[#397849]">
                      {crop.category}
                    </span>
                  </div>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#69766b]">
                    {crop.description}
                  </p>

                  <Link
                    to="/commodities"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#28713d] transition-all hover:gap-2"
                  >
                    Explore commodity
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-[#879287]">
            These are examples of crop categories RiceLink is designed to
            support. They are not a statement of current live supply.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-[#fafcf9] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6e896f]">
              How RiceLink works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#203628] sm:text-4xl">
              Making agricultural connections easier.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#667469]">
              Finding the right agricultural partner takes more than knowing
              what crop is available. People need clear information and a
              way to discuss the details.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <article
                  key={step.number}
                  className="group rounded-2xl border border-[#e6ece3] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c7d9c3] hover:shadow-[0_18px_35px_-20px_rgba(25,65,35,0.3)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-widest text-[#a0ada0] group-hover:text-[#397849]">
                      {step.number}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#397849] transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-bold text-[#29402e] group-hover:text-[#28713d]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#69766b]">
                    {step.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Participants */}
      <section
        id="participants"
        className="scroll-mt-24 bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6e896f]">
              Who RiceLink is for
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#203628] sm:text-4xl">
              Different roles. Shared opportunities.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#667469]">
              Every participant has a different role in the agricultural
              supply chain. RiceLink provides a common place to make those
              connections.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {participants.map((participant) => {
              const Icon = participant.icon

              return (
                <article
                  key={participant.title}
                  className="group rounded-2xl border border-[#e6ece3] bg-[#fcfdfb] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c7d9c3] hover:bg-[#f8fbf6] hover:shadow-[0_18px_35px_-20px_rgba(25,65,35,0.25)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#397849] transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-5 text-base font-bold text-[#2b4030] group-hover:text-[#28713d]">
                    {participant.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#69766b]">
                    {participant.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section
        id="faq"
        className="scroll-mt-24 bg-[#fafcf9] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3e7] text-[#397849]">
                <CircleHelp className="h-6 w-6" />
              </span>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#6e896f]">
                Frequently asked questions
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#203628] sm:text-4xl">
                What would you like to know?
              </h2>

              <p className="mt-4 text-base leading-7 text-[#667469]">
                Learn more about how RiceLink works, who can participate and
                what to expect when using the platform.
              </p>

              <div className="mt-7 rounded-2xl border border-[#e2eade] bg-white p-5">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-[#397849]" />
                  <p className="text-sm font-bold text-[#29402f]">
                    Still exploring?
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#69766b]">
                  Browse the commodity catalogue to learn about the crops
                  supported by RiceLink.
                </p>
                <Link
                  to="/commodities"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#28713d] hover:gap-2"
                >
                  Explore commodities
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-[#e5ebe2] border-y border-[#e5ebe2]">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.question

                return (
                  <div
                    key={faq.question}
                    className="py-5"
                    onMouseEnter={() => setOpenFaq(faq.question)}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-sm font-semibold text-[#29402f] transition-colors hover:text-[#28713d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#397849] focus-visible:ring-offset-4 sm:text-base"
                      onClick={() => setOpenFaq(faq.question)}
                    >
                      <span>{faq.question}</span>

                      <ChevronRight
                        className={`h-5 w-5 shrink-0 text-[#6e896f] transition-transform duration-300 ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-3 max-w-3xl pr-6 text-sm leading-7 text-[#69766b]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact and getting started */}
      <section
        id="contact"
        className="scroll-mt-24 bg-[#17432a] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b9d6b8]">
                Connect with RiceLink
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Every agricultural connection starts somewhere.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#d2e0d2]">
                Whether you produce crops, source agricultural commodities,
                process raw materials or provide services across the supply
                chain, RiceLink is designed to help you discover opportunities
                and connect with relevant participants.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register">
                  <Button
                    size="lg"
                    fullWidth
                    className="text-[#1b4c2d] hover:bg-white/10 hover:text-white"
                    icon={<ArrowRight className="h-5 w-5" />}
                  >
                    Join RiceLink
                  </Button>
                </Link>

                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    fullWidth
                    className="border-white text-white hover:bg-white/10 hover:text-white"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/register"
                className="group rounded-2xl border border-white/15 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Users className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">
                  Become a participant
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#d2e0d2]">
                  Create an account and select the role that describes your
                  place in the agricultural supply chain.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                to="/commodities"
                className="group rounded-2xl border border-white/15 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Wheat className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">
                  Explore commodities
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#d2e0d2]">
                  Discover the different agricultural crop categories
                  represented across the RiceLink platform.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                  View catalogue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <a
                href="/#faq"
                className="group rounded-2xl border border-white/15 bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:col-span-2"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">
                  Have questions before joining?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#d2e0d2]">
                  Read through our frequently asked questions to understand
                  registration, verification, listings, matching and
                  communication on RiceLink.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Read the FAQs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </div>
          </div>

          <div className="mt-14 border-t border-white/15 pt-6">
            <p className="text-center text-xs leading-6 text-[#b9d0ba]">
              RiceLink helps agricultural participants discover and coordinate
              opportunities. Participants are responsible for verifying
              information, agreeing on terms and arranging their transactions.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
