
import { Link } from 'react-router-dom'
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
    title: 'Aggregators',
    description:
      'Bring supply from different producers together and make it easier to coordinate availability.',
  },
  {
    icon: Wheat,
    title: 'Processors',
    description:
      'Communicate sourcing requirements and find agricultural produce that fits your needs.',
  },
  {
    icon: ShoppingBasket,
    title: 'Buyers and distributors',
    description:
      'Discover available produce, compare supply details and connect with potential suppliers.',
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
      'Make an enquiry and communicate directly about quantity, quality, pricing and delivery arrangements.',
  },
]

const cropExamples = [
  'Rice',
  'Maize',
  'Cassava',
  'Sorghum',
  'Soybeans',
  'Yam',
  'Cowpea',
  'Groundnut',
]

export function HomePage() {
  return (
    <div className="overflow-hidden bg-white text-gray-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#f5f9f3]">
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

          {/* Animated RiceLink workflow illustration */}
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
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4e7] text-[#327343] transition-transform duration-500 hover:rotate-12 hover:scale-110">
                  <Leaf className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 animate-[fade-up_700ms_ease-out_400ms_both] rounded-2xl border border-[#e6ede3] bg-[#fbfdf9] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f1e1] text-[#347445] transition-transform duration-300 hover:scale-110">
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

              <div className="flex animate-[fade-up_650ms_ease-out_550ms_both] items-center justify-center gap-3 py-4">
                <span className="h-px flex-1 bg-[#e5ebe2]" />
                <span className="animate-[soft-pulse_3s_ease-in-out_infinite] text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a998b]">
                  Discover and connect
                </span>
                <span className="h-px flex-1 bg-[#e5ebe2]" />
              </div>

              <div className="animate-[fade-up_700ms_ease-out_650ms_both] rounded-2xl border border-[#eee7d8] bg-[#fffdf8] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0d9] text-[#a66b20] transition-transform duration-300 hover:scale-110">
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
                    <p className="text-xs text-[#93816b]">
                      Looking for
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#55432c]">
                      Agricultural produce
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eddfc7] bg-white px-3 py-2 text-xs font-semibold text-[#89612e] transition-colors duration-300 hover:bg-[#fff3df]">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Make an enquiry
                  </span>
                </div>
              </div>

              <div className="mt-5 flex animate-[fade-up_700ms_ease-out_800ms_both] items-start gap-3 rounded-xl bg-[#f1f6ef] p-4">
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

      {/* Crop categories */}
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6e896f]">
              A multi-crop approach
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#203b28]">
              One platform. Different crops.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {cropExamples.map((crop, index) => (
              <span
                key={crop}
                style={{ animationDelay: `${index * 60}ms` }}
                className="animate-[fade-up_500ms_ease-out_both] rounded-full border border-[#e4ebe1] bg-[#fafcf9] px-4 py-2 text-sm font-medium text-[#536457] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b9d3b6] hover:bg-[#eff7ed] hover:text-[#28613a]"
              >
                {crop}
              </span>
            ))}

            <Link
              to="/commodities"
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#28713d] transition-all duration-200 hover:translate-x-1 hover:bg-[#f1f6ef]"
            >
              Explore catalogue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 bg-[#fafcf9] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-[fade-up_700ms_ease-out_both]">
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
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <article
                  key={step.number}
                  style={{ animationDelay: `${index * 140}ms` }}
                  className="group animate-[fade-up_700ms_ease-out_both] rounded-2xl border border-[#e6ece3] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c7d9c3] hover:shadow-[0_18px_35px_-20px_rgba(25,65,35,0.3)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-widest text-[#a0ada0] transition-colors duration-300 group-hover:text-[#397849]">
                      {step.number}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#397849] transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-[#dcebd8]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-bold text-[#29402e] transition-colors duration-300 group-hover:text-[#28713d]">
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
      <section id="participants" className="scroll-mt-24 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-[fade-up_700ms_ease-out_both]">
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

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {participants.map((participant, index) => {
              const Icon = participant.icon

              return (
                <article
                  key={participant.title}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="group animate-[fade-up_700ms_ease-out_both] rounded-2xl border border-[#e6ece3] bg-[#fcfdfb] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c7d9c3] hover:bg-[#f8fbf6] hover:shadow-[0_18px_35px_-20px_rgba(25,65,35,0.25)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#397849] transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-[#dcebd8]">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-5 text-base font-bold text-[#2b4030] transition-colors duration-300 group-hover:text-[#28713d]">
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

      {/* Final call to action */}
      <section className="bg-[#17432a] py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl animate-[fade-up_700ms_ease-out_both]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b9d6b8]">
              Your next connection starts here
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Have produce to offer or a requirement to fill?
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d2e0d2] sm:text-base">
              Join RiceLink and explore a more connected way to discover
              agricultural supply and communicate sourcing needs.
            </p>
          </div>

          <div className="flex animate-[fade-up_700ms_ease-out_200ms_both] shrink-0 flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button
                size="lg"
                fullWidth
                className="text-[#1b4c2d] hover:bg-white/10 hover:text-white"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                Create an account
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
      </section>
    </div>
  )
}
