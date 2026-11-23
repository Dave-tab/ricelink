
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Sprout,
  UserRound,
  Building2,
  Boxes,
  Factory,
  ShoppingBasket,
  Warehouse,
  Truck,
  Check,
  ShieldCheck,
  Upload,
  FileText,
  MapPin,
  LockKeyhole,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const ROLES = [
  {
    id: 'producer',
    label: 'Farmer / Producer',
    desc: 'Grow and harvest crops',
    icon: Sprout,
  },
  {
    id: 'aggregator',
    label: 'Aggregator',
    desc: 'Source and consolidate produce',
    icon: Boxes,
  },
  {
    id: 'cooperative',
    label: 'Cooperative',
    desc: 'Represent a farming group',
    icon: UserRound,
  },
  {
    id: 'processor',
    label: 'Processor / Miller',
    desc: 'Process agricultural produce',
    icon: Factory,
  },
  {
    id: 'buyer',
    label: 'Commercial Buyer',
    desc: 'Purchase agricultural produce',
    icon: ShoppingBasket,
  },
  {
    id: 'distributor',
    label: 'Distributor',
    desc: 'Distribute agricultural products',
    icon: Boxes,
  },
  {
    id: 'storage',
    label: 'Storage Provider',
    desc: 'Provide produce storage',
    icon: Warehouse,
  },
  {
    id: 'logistics',
    label: 'Logistics Operator',
    desc: 'Transport agricultural produce',
    icon: Truck,
  },
]

const inputStyles =
  'w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3.5 text-sm text-[#243b2b] outline-none transition-all duration-200 placeholder:text-[#a0aca2] hover:border-[#b8cbb8] focus:border-[#39834b] focus:ring-4 focus:ring-[#39834b]/10'

const labelStyles =
  'mb-2 block text-sm font-semibold text-[#344b38]'

const steps = [
  'Account details',
  'Agricultural profile',
  'Verification',
]

export function RegisterPage() {
  const [step, setStep] = useState(0)

  const [accountType, setAccountType] = useState<
    'individual' | 'organization'
  >('individual')

  const [roles, setRoles] = useState<string[]>(['producer'])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [orgName, setOrgName] = useState('')
  const [registrationStatus, setRegistrationStatus] = useState<
    'registered' | 'informal'
  >('informal')

  const [state, setState] = useState('')
  const [lga, setLga] = useState('')
  const [town, setTown] = useState('')

  const [evidenceType, setEvidenceType] = useState('')
  const [evidenceDescription, setEvidenceDescription] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)

  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState('')

  const toggleRole = (roleId: string) => {
    setRoles((current) =>
      current.includes(roleId)
        ? current.filter((role) => role !== roleId)
        : [...current, roleId],
    )
  }

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (step === 0) {
      if (password !== confirmPassword) {
        setError('Your passwords do not match.')
        return
      }

      if (password.length < 8) {
        setError('Your password must contain at least 8 characters.')
        return
      }
    }

    if (step === 1) {
      if (roles.length === 0) {
        setError('Please select at least one participation role.')
        return
      }

      if (accountType === 'organization' && !orgName.trim()) {
        setError('Please enter your organization name.')
        return
      }
    }

    if (step < 2) {
      setStep((current) => current + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!evidenceType) {
      setError('Please select an evidence category.')
      return
    }

    if (!evidenceDescription.trim()) {
      setError('Please provide some information about your evidence.')
      return
    }

    // Frontend preview only. No account, document or verification
    // information is sent to a backend at this stage.
    setIsComplete(true)
  }

  const handleBack = () => {
    setError('')
    setStep((current) => Math.max(0, current - 1))
  }

  if (isComplete) {
    return (
      <div className="animate-[fade-up_500ms_ease-out_both]">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf4e7] text-[#28713d]">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6e896f]">
          RiceLink onboarding
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#203628] sm:text-3xl">
          Your onboarding is complete
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#718073]">
          You've provided the information needed to begin your RiceLink
          registration and verification process.
        </p>

        <div className="mt-7 rounded-2xl border border-[#e3eae1] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff5df] text-[#a66c16]">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#304735]">
                Verification not yet completed
              </p>
              <p className="mt-1 text-xs text-[#829084]">
                Your information requires backend submission and review.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#f5f8f3] p-4">
            <p className="text-xs leading-5 text-[#748276]">
              Completing this form does not automatically verify your
              identity or business. RiceLink will only display a verified
              status after the required checks have been completed and
              approved.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#e3eae1] p-4">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#438451]" />
          <p className="text-xs leading-5 text-[#748276]">
            This is currently a frontend demonstration. Your details and
            selected evidence have not been saved or submitted to a
            verification service.
          </p>
        </div>

        <div className="mt-7">
          <Link to="/login">
            <Button fullWidth size="lg" icon={<ArrowRight className="h-5 w-5" />}>
              Continue to sign in
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-[fade-up_650ms_ease-out_both]">
      <div className="mb-7">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4e7] text-[#28713d]">
          <Sprout className="h-6 w-6" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6e896f]">
          Join the RiceLink network
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#203628] sm:text-3xl">
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#718073]">
          Set up your account, tell us how you participate in agriculture,
          and provide information for verification.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-[#344b38]">
            Step {step + 1} of 3
          </span>
          <span className="text-xs text-[#829084]">
            {steps[step]}
          </span>
        </div>

        <div className="flex gap-2">
          {steps.map((item, index) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                index <= step ? 'bg-[#39834b]' : 'bg-[#e6ece4]'
              }`}
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {steps.map((item, index) => (
            <span
              key={item}
              className={`text-[10px] font-semibold sm:text-xs ${
                index === step ? 'text-[#28713d]' : 'text-[#9aa69b]'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {step === 0 && (
          <div className="animate-[fade-up_300ms_ease-out_both] space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelStyles}>
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputStyles}
                  placeholder="Your first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className={labelStyles}>
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputStyles}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelStyles}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelStyles}>
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputStyles}
                placeholder="e.g. 08012345678"
              />
              <p className="mt-2 text-xs text-[#89968b]">
                Use a phone number you can access. RiceLink will use it
                for contact and phone verification.
              </p>
            </div>

            <div>
              <label htmlFor="password" className={labelStyles}>
                Create password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputStyles} pr-12`}
                  placeholder="At least 8 characters"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#829084] transition-colors hover:bg-[#f1f6ef] hover:text-[#28713d]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelStyles}>
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputStyles} pr-12`}
                  placeholder="Enter your password again"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#829084] transition-colors hover:bg-[#f1f6ef] hover:text-[#28713d]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-[fade-up_300ms_ease-out_both] space-y-6">
            <div>
              <label className={labelStyles}>
                What type of account do you need?
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: 'individual',
                    label: 'Individual',
                    desc: 'Register as a person',
                    icon: UserRound,
                  },
                  {
                    id: 'organization',
                    label: 'Organization',
                    desc: 'Company or cooperative',
                    icon: Building2,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  const selected = accountType === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setAccountType(
                          item.id as 'individual' | 'organization',
                        )
                      }
                      aria-pressed={selected}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                        selected
                          ? 'border-[#39834b] bg-[#f1f8ef] shadow-sm'
                          : 'border-[#e3eae1] bg-white hover:border-[#b8cbb8]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon
                          className={`h-5 w-5 ${
                            selected ? 'text-[#28713d]' : 'text-[#89978a]'
                          }`}
                        />
                        {selected && (
                          <Check className="h-4 w-4 text-[#28713d]" />
                        )}
                      </div>

                      <p className="mt-3 text-sm font-bold text-[#2d4432]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-[#819083]">
                        {item.desc}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {accountType === 'organization' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="orgName" className={labelStyles}>
                    Organization or business name
                  </label>
                  <input
                    id="orgName"
                    type="text"
                    required
                    autoComplete="organization"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className={inputStyles}
                    placeholder="Enter your organization name"
                  />
                </div>

                <div>
                  <label className={labelStyles}>
                    Business registration status
                  </label>

                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e3eae1] p-3">
                      <input
                        type="radio"
                        name="registrationStatus"
                        checked={registrationStatus === 'registered'}
                        onChange={() => setRegistrationStatus('registered')}
                        className="mt-1 accent-[#39834b]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[#344b38]">
                          Formally registered
                        </span>
                        <span className="mt-1 block text-xs text-[#829084]">
                          My business or organization has formal registration.
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e3eae1] p-3">
                      <input
                        type="radio"
                        name="registrationStatus"
                        checked={registrationStatus === 'informal'}
                        onChange={() => setRegistrationStatus('informal')}
                        className="mt-1 accent-[#39834b]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[#344b38]">
                          Not formally registered
                        </span>
                        <span className="mt-1 block text-xs text-[#829084]">
                          I operate an informal agricultural business or group.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className={labelStyles}>
                How do you participate in the agricultural supply chain?
              </label>
              <p className="mb-3 text-xs text-[#829084]">
                Select all that apply. You can have more than one role.
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ROLES.map((item) => {
                  const Icon = item.icon
                  const selected = roles.includes(item.id)

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleRole(item.id)}
                      aria-pressed={selected}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                        selected
                          ? 'border-[#39834b] bg-[#f1f8ef] shadow-sm'
                          : 'border-[#e3eae1] bg-white hover:border-[#b8cbb8]'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          selected
                            ? 'bg-[#dcebd8] text-[#28713d]'
                            : 'bg-[#f4f6f3] text-[#7b8c7d]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-[#304735]">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-[11px] text-[#829084]">
                          {item.desc}
                        </span>
                      </span>

                      {selected && (
                        <Check className="h-4 w-4 shrink-0 text-[#28713d]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className={labelStyles}>
                Where are you based?
              </label>

              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputStyles}
                  placeholder="State"
                  autoComplete="address-level1"
                />

                <input
                  type="text"
                  required
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className={inputStyles}
                  placeholder="Local Government Area"
                />

                <input
                  type="text"
                  required
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className={inputStyles}
                  placeholder="Town or community"
                  autoComplete="address-level2"
                />
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-[#89968b]">
                <MapPin className="h-3.5 w-3.5" />
                Your location helps other participants understand where
                you operate.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-[fade-up_300ms_ease-out_both] space-y-5">
            <div className="rounded-xl border border-[#dce9d8] bg-[#f4f9f1] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#39834b]" />
                <div>
                  <p className="text-sm font-bold text-[#304735]">
                    Help us establish trust
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#718073]">
                    RiceLink uses verification to help participants build
                    confidence in the people and businesses they interact
                    with. You do not need formal company registration to
                    provide alternative evidence.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyles}>
                What evidence can you provide?
              </label>

              <select
                required
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                className={inputStyles}
              >
                <option value="">Select an evidence category</option>

                {accountType === 'individual' ? (
                  <>
                    <option value="government_id">
                      Government-issued identity document
                    </option>
                    <option value="community_attestation">
                      Community or traditional leader attestation
                    </option>
                    <option value="cooperative_membership">
                      Cooperative or association membership
                    </option>
                    <option value="farm_evidence">
                      Farm or agricultural activity evidence
                    </option>
                    <option value="business_reference">
                      Agricultural business reference
                    </option>
                  </>
                ) : (
                  <>
                    {registrationStatus === 'registered' && (
                      <option value="business_registration">
                        Business registration document
                      </option>
                    )}
                    <option value="community_attestation">
                      Community or traditional leader attestation
                    </option>
                    <option value="cooperative_evidence">
                      Cooperative or association evidence
                    </option>
                    <option value="business_activity">
                      Evidence of business operations
                    </option>
                    <option value="business_reference">
                      Business or trading reference
                    </option>
                    <option value="farm_evidence">
                      Farm, facility or operational location evidence
                    </option>
                  </>
                )}
              </select>

              <p className="mt-2 text-xs leading-5 text-[#89968b]">
                RiceLink should provide suitable alternative evidence
                routes for informal businesses and independent farmers.
              </p>
            </div>

            <div>
              <label htmlFor="evidenceDescription" className={labelStyles}>
                Tell us about your evidence
              </label>
              <textarea
                id="evidenceDescription"
                required
                rows={4}
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
                className={`${inputStyles} resize-y`}
                placeholder="Explain what the evidence demonstrates and how it relates to you or your agricultural business."
              />
            </div>

            <div>
              <label className={labelStyles}>
                Supporting document (optional for this frontend preview)
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dce5dc] bg-[#fafcf9] px-5 py-7 text-center transition-colors hover:border-[#39834b] hover:bg-[#f4f9f1]">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4e7] text-[#39834b]">
                  <Upload className="h-5 w-5" />
                </span>

                <span className="text-sm font-semibold text-[#344b38]">
                  {evidenceFile ? evidenceFile.name : 'Choose a document'}
                </span>

                <span className="mt-1 text-xs text-[#89968b]">
                  PDF, JPG or PNG
                </span>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) =>
                    setEvidenceFile(e.target.files?.[0] ?? null)
                  }
                />
              </label>

              <p className="mt-2 text-xs leading-5 text-[#89968b]">
                Do not upload sensitive identity documents into this
                demonstration. Secure document storage and submission
                will be connected through the backend.
              </p>
            </div>

            <div className="rounded-xl border border-[#e3eae1] p-4">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#438451]" />
                <p className="text-xs leading-5 text-[#748276]">
                  Your evidence must be reviewed before RiceLink can
                  display an identity or business verification badge.
                  Submitting information is not the same as being verified.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            icon={
              step === 2 ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )
            }
          >
            {step === 2 ? 'Complete onboarding' : 'Continue'}
          </Button>
        </div>
      </form>

      <div className="mt-7 border-t border-[#edf0eb] pt-6 text-center">
        <p className="text-sm text-[#778278]">
          Already have a RiceLink account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#28713d] transition-colors hover:text-[#17432a] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}