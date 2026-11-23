# RICELINK

## Product, Architecture & Backend Implementation Handover

**Document status:** Current working source of truth  
**Project:** RiceLink — Multi-Crop Agricultural Supply-Chain Coordination Platform  
**Primary market:** Nigeria  
**Frontend stack:** React, TypeScript, Vite, Tailwind CSS v4  
**Backend stack:** Supabase, PostgreSQL, Supabase Auth, Supabase Storage  
**Deployment target:** Vercel  
**Architecture:** Modular monolith  
**Current phase:** Frontend implementation and product-definition consolidation  
**Backend/database status:** Not yet implemented

---

# 1. Purpose of This Document

This document consolidates RiceLink's product decisions, implementation rules, technical direction, frontend status, business logic and backend requirements.

It is intended to guide:

- Backend and database implementation.
- PostgreSQL schema design.
- Supabase Auth integration.
- Row Level Security (RLS) policies.
- Storage and document access.
- Frontend-to-backend integration.
- Matching and negotiation logic.
- Testing and deployment.
- Future development without changing previously approved decisions unintentionally.

This document is the current implementation reference. Older proposals and documents may contain earlier product assumptions. Where those assumptions conflict with this document, the current approved product decisions take precedence.

## 1.1 Implementation governance

1. Do not invent business rules, user permissions, data or product functionality.
2. Do not change approved architecture without discussing and obtaining approval.
3. Do not confuse frontend demonstrations with completed backend functionality.
4. Do not treat mock data as real users, organisations, transactions or verified activity.
5. Do not introduce additional services or dependencies without a clear requirement.
6. Keep implementation modular and maintainable.
7. Keep business logic outside reusable presentation components.
8. Use the database as the authoritative source of persistent application data.
9. Enforce security and permissions on the backend, not only through frontend conditions.
10. Preserve existing routes and working functionality when integrating the backend.
11. Implement and test in manageable stages.
12. Document significant implementation decisions and changes.

The project owner remains the final decision-maker on product scope and architecture.

---

# 2. Product Definition

RiceLink is a multi-crop agricultural supply-chain coordination platform that helps agricultural participants discover, evaluate and coordinate supply and demand opportunities.

It connects participants such as:

- Farmers and producers.
- Aggregators.
- Cooperatives.
- Processors and millers.
- Commercial buyers.
- Distributors.
- Storage providers.
- Logistics operators.

The platform aims to improve visibility and coordination across agricultural supply chains.

RiceLink is not restricted to rice. It must support different agricultural commodities and their varieties.

## 2.1 Core product capabilities

The product is organised around:

1. User accounts and profiles.
2. Individual and organisation participation.
3. Organisation membership and role management.
4. Verification and trust.
5. Crop and commodity discovery.
6. Supply listing management.
7. Demand listing management.
8. Deterministic supply-demand matching.
9. Enquiries and private conversations.
10. Commercial offers and counteroffers.
11. Agreement records.
12. Payment and delivery status tracking.
13. Notifications and activity updates.

Some of these capabilities currently exist only as frontend demonstrations. Their backend implementation remains outstanding.

## 2.2 Product principle

RiceLink coordinates agricultural opportunities. It does not automatically guarantee that a supplier owns the advertised goods, that a buyer has funds, that quality claims are accurate or that delivery will occur.

Verification, matching and agreement records must never be presented as guarantees of transaction performance.

---

# 3. Technology and Architecture

## 3.1 Approved technology stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Icons | Lucide React |
| Server state / data fetching | TanStack Query, where appropriate |
| Backend platform | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Server-side operations | Supabase Edge Functions, where required |
| Hosting | Vercel |

The existing frontend also contains a Supabase client file, but the current product workflows are not yet connected to persistent Supabase data.

## 3.2 Architectural approach

Use a **modular monolith**.

The frontend should retain feature-based organisation. Supabase provides the managed backend infrastructure.

PostgreSQL is the authoritative source of persistent application data.

Use Supabase services for:

- Authentication and sessions.
- Relational data.
- Database access policies.
- Private file storage.
- Realtime capabilities only where a genuine requirement justifies them.
- Edge Functions for privileged or server-side operations where necessary.

Do not introduce:

- Microservices.
- A separate custom backend server without a demonstrated requirement.
- AI matching.
- A standalone logistics marketplace.
- Automated payment processing.
- Complex distributed chat infrastructure.

A separate backend service should only be considered if a concrete security, integration or processing requirement cannot reasonably be handled with Supabase.

## 3.3 Proposed project organisation

The current frontend structure should be preserved and extended deliberately.

```text
src/
  app/
    providers/
    router/

  components/
    layout/
    ui/

  data/
    mock-data.ts

  features/
    auth/
    organizations/
    commodities/
    supply/
    demand/
    matching/
    inquiries/
    dashboard/
    orders/
    notifications/

  lib/
    supabase/
    matching-engine.ts

  types/

supabase/
  migrations/
  functions/

docs/
  RICELINK_PRODUCT_AND_BACKEND_HANDOVER.md

.env.example
```

This is a logical organisation, not an instruction to create empty modules or implement unapproved features.

---

# 4. User Accounts, Roles and Organisations

This is one of the most important architectural decisions.

## 4.1 Individual and organisation accounts

RiceLink supports two account contexts:

- Individual.
- Organisation.

An individual can participate independently and can also represent one or more organisations.

An organisation can have multiple members.

Do not assume that a user can belong to only one organisation.

Do not assume that an individual's role is identical to their role in every organisation they represent.

## 4.2 Multiple roles

A user can hold multiple agricultural roles.

The supported roles are:

1. Farmer / Producer.
2. Aggregator.
3. Cooperative.
4. Processor / Miller.
5. Commercial Buyer.
6. Distributor.
7. Storage Provider.
8. Logistics Operator.

A user may select multiple roles during onboarding.

Roles must not be treated as permissions by themselves.

The system must distinguish:

- A person's account.
- Their personal agricultural roles.
- The organisations they belong to.
- Their membership role or authority in each organisation.
- Their ability to perform specific actions.
- Their supply listings.
- Their demand listings.

## 4.3 Recommended conceptual separation

The backend should represent these concepts separately:

- User identity and account profile.
- Individual role assignments.
- Organisation records.
- Organisation memberships.
- Membership permissions or authority.
- Verification records.

An organisation's administrator should not automatically gain access to every other organisation represented by that user.

An organisation's records must not become visible to unrelated users merely because they share an account with a member.

## 4.4 Organisation membership

The backend must support:

- An organisation having multiple members.
- A user belonging to multiple organisations.
- Different roles within different organisations.
- Organisation-specific access permissions.
- Membership status and access control.
- Clear ownership and authority over organisation records.

Exact invitation, approval and membership-management workflows must be finalised before implementation if they are included in the first release.

---

# 5. Verification and Trust

Verification is a mandatory part of the trading-access workflow.

## 5.1 Onboarding and trading access

Users must complete onboarding and the required verification process before they can participate in trading activities.

Unverified users must not be able to:

- Publish supply listings.
- Publish demand listings.
- Negotiate commercial terms.
- Participate in active transactions.

Users with pending verification may browse the platform in a restricted, read-only state.

The frontend must not be the only place where these restrictions are enforced.

## 5.2 Verification categories

Keep verification distinct across:

1. Contact verification.
2. Personal identity verification.
3. Business or organisation verification.

A verified phone number does not mean the user's identity is verified.

A verified individual does not automatically verify every organisation they represent.

An organisation's verification status must not be inferred from the personal identity status of one member.

## 5.3 Verification states

The conceptual states are:

- Unverified.
- Pending review.
- Verified.
- Rejected.

Rejected submissions should include a reason and an appropriate resubmission process.

Evidence submitted by a user must remain pending until an authorised reviewer approves it.

No verified badge should appear before approval.

## 5.4 Alternative verification

RiceLink must consider independent farmers and informal agricultural businesses that may not have formal business registration documents.

The verification process should support alternative evidence routes where appropriate.

Potential evidence categories include:

- Cooperative membership.
- Community or traditional-leader attestation.
- Farm or operational evidence.
- Business or trading references.
- Other approved evidence types.

These are candidate evidence categories, not a final automatic approval policy. Acceptance criteria must be defined before backend implementation.

## 5.5 Verification security

- Evidence files must not be publicly accessible by default.
- Only authorised reviewers should access restricted verification evidence.
- Users should only access their own submissions and permitted organisation records.
- Review actions must be authorised and auditable.
- Do not casually collect or store NIN or other sensitive identity documents.
- Establish a lawful basis, access policy, retention policy and security controls before collecting sensitive information.
- Verification must not be presented as a guarantee of quality, honesty, ownership or delivery.

---

# 6. Commodity Catalogue and Crop Flexibility

RiceLink is a multi-crop platform.

The commodity catalogue is reference data. Supply and demand listings are operational records.

These must remain separate.

## 6.1 Catalogue purpose

The catalogue can provide:

- Commodity names.
- Commodity codes.
- Categories.
- Descriptions.
- Known varieties.
- Reference units.
- Known grades.
- Reference quality attributes.
- Other useful descriptive information.

The current frontend contains five illustrative catalogue records:

- Faro 44 Paddy Rice.
- Yellow Maize (QPM).
- White Sorghum (Farafara).
- TME 419 Cassava Tubers.
- Soybeans (TGX 1448-2E).

These are not the complete list of crops supported by RiceLink.

## 6.2 Custom crops

Users must be able to list a crop even when it is not in the catalogue.

The user must not be forced to choose an existing catalogue entry.

The system should support:

- Selecting a known catalogue commodity.
- Entering a custom commodity name.
- Entering a variety when known.
- Leaving variety unspecified when unknown.

Entering a custom crop must not automatically create an approved catalogue record.

Do not silently merge similarly named custom crops with catalogue commodities.

Matching must use controlled identity rules.

## 6.3 Catalogue governance

A future catalogue-management process may be required to review and standardise new crop entries.

Do not allow arbitrary listing submissions to modify trusted catalogue reference data automatically.

---

# 7. Supply Management

Supply and demand are separate workflows and separate records.

A supply listing represents agricultural goods that a participant says are available or expected to become available.

## 7.1 Supply information

The current frontend captures information such as:

- Commodity name.
- Optional catalogue commodity reference.
- Variety, if known.
- Quantity.
- Quantity unit.
- Optional kilograms per package or unit.
- Optional moisture information.
- State.
- LGA.
- Town or location.
- Facility or storage location name, where applicable.
- Asking price, where provided.

The final database design must preserve the distinction between required and optional fields.

## 7.2 Quantity rules

Never assume every bag, basket, heap or package has the same weight.

Every quantity must have an explicit unit.

Where conversion to metric tonnes is needed:

- Use a known supported unit conversion.
- Or use an explicitly provided kilograms-per-unit value.
- Do not guess package weights.
- Do not display a derived metric-tonne quantity when the conversion is unknown.

## 7.3 Supply workflow

The system should support appropriate listing states.

The existing matching engine recognises these supply statuses:

- `verified`
- `in_aggregation`
- `inspected`
- `allocated`
- `in_transit`

The matching engine currently considers the first three eligible and excludes allocated and in-transit supply.

The final allowed transitions, who may perform them and what evidence is required must be defined in the backend workflow before implementation.

## 7.4 Supply ownership

The backend must record who created and controls a listing.

The listing must support the correct ownership context:

- Individual account.
- Organisation account.

Do not assume that the person creating a listing personally owns the goods.

Represent the listing's declared ownership or representation context clearly.

---

# 8. Demand Management

A demand tender represents a buyer's procurement requirement.

It is not a supply listing.

## 8.1 Demand information

The current frontend captures information such as:

- Commodity name.
- Optional catalogue commodity reference.
- Optional variety preference.
- Required quantity.
- Explicit quantity unit.
- Delivery or destination location.
- Optional quality or moisture requirements.
- Optional target price.
- Required delivery or procurement timing, where provided.

Do not force users to provide information they genuinely do not know.

Do not assume that every buyer has a variety preference or target price.

## 8.2 Demand workflow

The current matching engine recognises these demand states:

- `open`
- `evaluating`
- `partially_matched`

The final demand lifecycle and status transitions must be explicitly defined before the database is finalised.

## 8.3 Demand ownership

As with supply, demand records must have an explicit creator and ownership context.

A user may submit a demand on behalf of an organisation where they have the required authority.

---

# 9. Matching Engine

RiceLink currently uses deterministic, rule-based matching.

AI matching is not part of the MVP.

The frontend matching engine is located at:

`src/lib/matching-engine.ts`

## 9.1 Matching principle

A match is a potential compatibility between a supply listing and a demand tender.

A match is not a transaction, confirmed sale or guarantee of delivery.

## 9.2 Eligibility rules

The matching engine must consider:

1. Commodity identity.
2. Quantity compatibility.
3. Quality and moisture requirements.
4. Variety preference.
5. Location compatibility.
6. Delivery timing.
7. Supply and demand status.

Hard eligibility constraints must be evaluated before ranking.

AI or scoring must never override a hard exclusion.

## 9.3 Commodity matching

- When both records have catalogue IDs, compare those IDs.
- When both are custom crop records without catalogue IDs, compare normalised crop names.
- If one record has a catalogue ID and the other does not, do not automatically assume they match.
- Do not use fuzzy matching to merge potentially different crops or varieties.

## 9.4 Quantity matching

Partial fulfilment is supported when the system can establish comparable metric-tonne quantities.

Only use known conversions.

Do not guess bag, basket or other package weights.

When quantity cannot be reliably converted, do not fabricate a quantity compatibility result.

## 9.5 Quality and variety

- Exclude supply that violates a buyer's explicit maximum moisture requirement.
- Treat unknown moisture as unknown, not as a passing result.
- Respect explicit variety preferences.
- An unknown supply variety may remain neutral rather than automatically fail.
- Do not invent laboratory inspection or quality evidence.

## 9.6 Location matching

The current engine recognises location compatibility conservatively.

It can identify:

- Same LGA.
- Same state.
- Wider market compatibility.

It does not currently have a reliable geographic distance or neighbouring-region dataset.

Therefore:

- Do not invent travel distances.
- Do not claim a location is nearby without evidence.
- Do not assume neighbouring LGAs or states.
- Do not present estimated travel times as verified.

## 9.7 Current scoring model

The current rule-based engine uses these weights:

| Criterion | Weight |
|---|---:|
| Location | 30 |
| Quantity | 25 |
| Quality | 20 |
| Variety | 15 |
| Delivery timing | 10 |
| **Total** | **100** |

The score is based on known information and must be accompanied by coverage or explanation.

An unknown field must not be treated as a confirmed positive result.

Location tier is considered before the final score in the current ranking logic.

The user interface must explain that a compatibility score is not a guarantee.

## 9.8 Match persistence

The current frontend calculates candidate matches locally.

The backend implementation must decide whether matches are:

- Calculated on demand.
- Persisted as match results.
- Recalculated when relevant supply or demand records change.

This decision must be made before implementing a permanent match-results table.

Regardless of the implementation, the database must remain the source of truth for the supply and demand records being evaluated.

---

# 10. Enquiries, Messaging and Negotiation

The messaging workflow is a central RiceLink capability.

It allows participants to move from discovering a potential opportunity to discussing and agreeing commercial terms.

The current frontend page is:

`src/features/inquiries/components/inquiries-coordination-page.tsx`

The current types are:

`src/types/inquiry.ts`

## 10.1 Conversation requirements

A conversation must be:

- Associated with a relevant supply listing.
- Associated with a demand tender where applicable.
- Private to its authorised participants.
- Persistent.
- Capable of containing messages, offers and negotiation history.

A conversation must not be visible to unrelated users.

A conversation should not disappear simply because the user navigates away or refreshes the page.

## 10.2 Conversation lifecycle

Current conceptual conversation states:

- `open`
- `negotiating`
- `agreement_reached`
- `closed`

A conversation may begin with an enquiry.

Participants can then discuss:

- Availability.
- Quantity.
- Commodity and variety.
- Quality.
- Price.
- Delivery location.
- Delivery date.
- Delivery arrangement.
- Other commercial requirements.

## 10.3 Message types

The current frontend types recognise:

- `chat`
- `milestone`
- `terms`
- `offer`
- `system`
- `attachment`

The old `terms` message type remains in the TypeScript union for compatibility, while the new structured offer workflow uses `offer`.

The backend should preserve the distinction between ordinary conversation messages and structured negotiation records.

## 10.4 Offer structure

A commercial offer contains:

- Commodity name.
- Optional variety.
- Optional grade.
- Quantity.
- Quantity unit.
- Price per unit.
- Currency.
- Delivery location.
- Optional delivery date.
- Optional delivery arrangement.
- Optional quality requirements.
- Optional additional notes.

The current currency type is NGN.

Price per unit must be interpreted together with its quantity unit.

For example:

`₦700,000 per MT`

must not be interpreted as a total price for an entire 42.5 MT order.

The total commercial value may be calculated from the agreed quantity and unit price, but the stored commercial terms must preserve both original values.

## 10.5 Offer statuses

The current offer type recognises:

- `pending`
- `accepted`
- `rejected`
- `countered`
- `withdrawn`
- `expired`

Offers must have an identifiable proposer and a record of their creation.

A counteroffer should preserve the previous offer relationship.

Do not overwrite previous offer terms when a counteroffer is submitted.

The negotiation history must remain available.

The current frontend demo changes an earlier pending offer to `countered` when a new offer is submitted. Confirm the exact policy for multiple simultaneous pending offers before enforcing it in the database.

## 10.6 Accepting an offer

When an authorised participant accepts a valid pending offer:

1. The accepted offer is identified.
2. Its commercial terms become the terms of the agreement.
3. An agreement record is created.
4. The agreement records the accepted offer reference.
5. The agreement records the parties and acceptance time.
6. The conversation status becomes `agreement_reached`.
7. The agreed terms must remain available as a historical snapshot.

The agreement must not silently change if an earlier offer record is later edited.

The system should prevent conflicting acceptance actions and enforce the final transition rules on the backend.

An agreement record does not automatically mean that a separate legal contract has been signed or that payment has been made.

## 10.7 Current negotiation data model

The current frontend types include:

- `InquiryThread`
- `InquiryMessage`
- `InquiryAttachment`
- `CommercialTerms`
- `NegotiationOffer`
- `Agreement`

The existing `InquiryThread` also contains references to the associated supply batch and optional demand tender.

The database schema should preserve these relationships.

## 10.8 Real messaging requirements

The current frontend is a local demonstration.

It does not yet provide:

- Server-side message persistence.
- Cross-user message delivery.
- Real-time message synchronisation.
- Persistent unread counts.
- Server-authoritative message timestamps.
- Reliable attachment uploads.
- Notifications to another participant.
- Delivery or read receipts.

These must be designed and implemented through the backend.

Do not present local React state changes as messages sent to another person.

Realtime capabilities should be introduced only when the underlying persistent conversation and authorisation model is correct.

---

# 11. Agreement, Payment and Delivery

Payment and delivery must remain separate from negotiation.

## 11.1 Agreement

An agreement is created when a valid offer is accepted.

It stores the accepted commercial terms and references the accepted offer.

It is not proof that funds have moved or goods have been delivered.

## 11.2 Payment status

The current frontend payment type recognises:

- `not_applicable`
- `not_initiated`
- `awaiting_payment`
- `payment_pending`
- `paid`
- `refunded`
- `disputed`

These are status concepts only at this stage.

The MVP must not claim to process or confirm real payments.

## 11.3 Delivery status

The current frontend delivery type recognises:

- `not_started`
- `preparing`
- `dispatched`
- `delivered`
- `received`
- `disputed`

Delivery status must be tracked separately from payment status.

A payment status change must not automatically imply a delivery status change.

A delivery status change must not automatically imply payment completion.

## 11.4 Escrow

Escrow is not implemented.

RiceLink must not:

- Collect funds.
- Hold user funds.
- Transfer funds.
- Claim to provide escrow protection.
- Display fabricated payment confirmations.
- Mark a transaction paid merely because an agreement was reached.

The current frontend should clearly state:

**Escrow is not available yet. RiceLink does not currently collect, hold or transfer funds.**

A future escrow or payment integration will require a suitable payment provider, a clear legal and operational model, security controls, reconciliation and dispute-handling rules.

Do not build a homemade wallet or hold customer funds without an approved and compliant design.

---

# 12. Notifications

Notifications are a planned product capability.

The current frontend does not yet provide a real persistent notification system.

Potential notification events include:

- New enquiry.
- New message.
- New offer.
- Counteroffer received.
- Offer accepted.
- Offer rejected.
- Agreement reached.
- Verification submitted.
- Verification approved or rejected.
- Supply or demand status changes relevant to a user.

Notifications must be generated from real authorised events.

Do not create fake notification counts or claim that another participant has been notified when no notification has been sent.

The backend should define notification ownership, event references, read status and timestamps before implementation.

---

# 13. Database Design Direction

This section describes the required conceptual model. It is not a final SQL schema.

Do not generate migrations from incomplete assumptions.

The final schema must be reconciled with the existing TypeScript types, approved workflows and access rules.

## 13.1 Core conceptual entities

| Domain | Conceptual records |
|---|---|
| Identity | Auth users, user profiles |
| Roles | Individual role assignments |
| Organisations | Organisations, organisation memberships |
| Verification | Verification submissions, evidence metadata, review decisions |
| Catalogue | Commodities, varieties, reference attributes |
| Supply | Supply listings, supply status history |
| Demand | Demand tenders, demand status history |
| Matching | Match evaluations or persisted match results, if approved |
| Enquiries | Conversation threads, conversation participants |
| Messaging | Messages, attachments |
| Negotiation | Offers, offer history, accepted agreements |
| Fulfilment | Payment status records, delivery status records |
| Notifications | User notifications |

These are logical entities, not a requirement that every concept must become a separate table.

Normalise the relational model where it improves integrity, permissions and maintainability.

## 13.2 Relationships to preserve

The final database design must support:

- One authenticated user having one profile.
- One user holding multiple personal roles.
- One user belonging to multiple organisations.
- One organisation having multiple members.
- A membership having organisation-specific authority.
- Supply listings belonging to an individual or organisation context.
- Demand tenders belonging to an individual or organisation context.
- Supply and demand records referencing a catalogue commodity when applicable.
- Custom commodity names when no catalogue reference exists.
- Conversations referencing relevant supply and demand records.
- Conversations having multiple authorised participants.
- Conversations having multiple messages.
- Conversations having multiple offers over time.
- Counteroffers referencing earlier offers.
- An agreement referencing the accepted offer.
- Payment and delivery records referencing the appropriate agreement or transaction.
- Notifications belonging to their intended recipient.

## 13.3 Database integrity

Use database constraints for important invariants.

Examples:

- Positive quantities.
- Positive unit prices where required.
- Non-empty required names.
- Valid status values.
- Valid foreign-key relationships.
- Unique organisation membership relationships where appropriate.
- Valid offer-to-conversation relationships.
- Agreement references to accepted offers.

Do not rely solely on frontend form validation.

Use transactions or carefully designed database functions for multi-step operations such as offer acceptance where partial updates would create inconsistent records.

---

# 14. Row Level Security and Authorisation

RLS is a core security requirement, not a later optional improvement.

Every exposed table must have a reviewed access policy.

## 14.1 General rules

- Enable RLS on tables exposed through Supabase APIs.
- Deny access by default where practical.
- Authorise actions using authenticated identity and trusted membership/role records.
- Never trust user IDs, organisation IDs or permissions supplied by the client without checking them.
- Do not expose service-role keys in the frontend.
- Do not rely on hiding a button to enforce permissions.
- Do not allow users to modify their own verification approval status.
- Do not allow a user to access another organisation's private records without membership authority.
- Do not allow unrelated users to read private conversations.
- Do not allow users to modify an accepted agreement's historical terms arbitrarily.

## 14.2 Access-control areas to implement

| Data area | Required access principle |
|---|---|
| User profile | Owner access, with carefully limited public fields |
| Personal roles | Owner-controlled, subject to approved role rules |
| Organisations | Members according to membership authority |
| Memberships | Controlled by authorised organisation administrators |
| Verification evidence | Owner submission access and authorised reviewer access |
| Supply listings | Owner/organisation control; public visibility only under approved publication rules |
| Demand tenders | Owner/organisation control; public visibility only under approved publication rules |
| Conversations | Authorised participants only |
| Messages | Authorised conversation participants only |
| Offers | Authorised conversation participants only |
| Agreements | Parties and authorised administrators according to policy |
| Notifications | Intended recipient only |

These are security requirements. The exact SQL policies must be written and tested against the final schema.

## 14.3 Privileged actions

Some operations may require server-side or transactional execution, including:

- Verification review.
- Offer acceptance.
- Agreement creation.
- Organisation membership administration.
- Protected status transitions.
- Administrative corrections.

Use Edge Functions or secure database functions where appropriate.

Never expose privileged credentials to the browser.

---

# 15. Storage Requirements

Supabase Storage is the approved file-storage service.

Potential file categories:

- Verification evidence.
- Organisation documents.
- Conversation attachments.
- Other explicitly approved agricultural records.

## 15.1 Storage rules

- Private by default.
- Validate file type and size.
- Use controlled object paths.
- Restrict upload and read access.
- Associate stored files with their owner and relevant record.
- Do not expose private verification evidence through public URLs.
- Do not treat a successful upload as approval of the submitted evidence.
- Avoid storing sensitive identity documents unless a defined requirement and protection policy exist.

The current frontend file picker is not a completed storage integration.

---

# 16. Frontend Implementation Status

The current frontend is a working demonstration of the intended product workflows.

It is not yet a complete production application.

## 16.1 Implemented frontend areas

| Feature | Current status |
|---|---|
| Landing page | Implemented |
| Login page | Frontend implementation |
| Registration/onboarding | Frontend implementation |
| Dashboard | Implemented with sample data |
| Commodity catalogue | Implemented with sample reference data |
| Supply management | Frontend implementation with local state |
| Demand management | Frontend implementation with local state |
| Compatibility matching | Deterministic client-side engine |
| Matching page | Implemented and build verified |
| Messaging and negotiation | Local frontend demonstration |
| Agreement summary | Local frontend demonstration |
| Transaction details | Frontend implementation |
| Organisation management | Not implemented |
| Profile management | Not implemented |
| Real notifications | Not implemented |
| Persistent orders/transactions | Not implemented |
| Backend authentication integration | Not implemented |
| Database persistence | Not implemented |
| RLS policies | Not implemented |
| Storage integration | Not implemented |

## 16.2 Current frontend source structure

```text
src/
  App.css
  App.tsx
  index.css
  main.tsx

  app/
    providers/
      index.tsx
      query-provider.tsx
    router/
      index.tsx

  components/
    layout/
      auth-layout.tsx
      dashboard-header.tsx
      dashboard-layout.tsx
      footer.tsx
      mobile-nav.tsx
      navbar.tsx
      root-layout.tsx
      sidebar.tsx
    ui/
      badge.tsx
      button.tsx
      not-found-page.tsx

  data/
    mock-data.ts

  features/
    auth/components/
      dashboard-page.tsx
      home-page.tsx
      login-page.tsx
      register-page.tsx

    commodities/components/
      commodity-catalogue-page.tsx

    dashboard/components/
      operational-overview-page.tsx

    demand/components/
      demand-tenders-page.tsx

    inquiries/components/
      inquiries-coordination-page.tsx

    matching/components/
      compatibility-matches-page.tsx

    organizations/components/

    supply/components/
      supply-management-page.tsx

  lib/
    supabase/client.ts
    matching-engine.ts

  types/
    commodity.ts
    demand.ts
    inquiry.ts
    matching.ts
    supply.ts
```

## 16.3 Frontend mock-data rules

`src/data/mock-data.ts` currently contains illustrative records for:

- Commodities.
- Supply batches.
- Demand tenders.
- Compatibility matches.
- Inquiry threads.

These records are not real platform activity.

They must not be treated as verified users, approved organisations, actual supply, actual demand or confirmed transactions.

When backend integration begins, mock data must be replaced by real data access in a controlled manner.

Do not keep duplicate sources of truth after integration.

---

# 17. Current Frontend Types

The existing types should be reviewed before final database migrations are created.

Current files:

```text
src/types/
  commodity.ts
  demand.ts
  inquiry.ts
  matching.ts
  supply.ts
```

The inquiry model already includes:

- `CoordinationMilestone`
- `ConversationStatus`
- `InquiryMessageType`
- `OfferStatus`
- `PaymentStatus`
- `DeliveryStatus`
- `CommercialTerms`
- `NegotiationOffer`
- `Agreement`
- `InquiryAttachment`
- `InquiryMessage`
- `InquiryThread`

The database implementation must preserve the intended meaning of these records.

However, TypeScript types are not automatically a final database schema. Confirm nullability, foreign keys, constraints, status transitions and ownership rules before writing migrations.

---

# 18. UX and Interface Rules

RiceLink should remain:

- Mobile-first.
- Responsive.
- Clear and practical.
- Accessible.
- Suitable for users with varying digital literacy.
- Appropriate for Nigerian agricultural contexts.
- Usable under unreliable or expensive internet conditions.

## 18.1 Visual direction

- Deep forest green as the primary brand colour.
- Restrained amber as an accent.
- Clean neutral backgrounds.
- Clear information hierarchy.
- Avoid unnecessary visual complexity.

## 18.2 Interaction rules

- Show loading, success, empty and error states.
- Do not show fake success messages before server confirmation.
- Distinguish pending, approved, rejected and unavailable states.
- Avoid forcing optional information.
- Use explicit quantity units.
- Explain unknown or incomplete information.
- Preserve useful form data when a recoverable operation fails.
- Use accessible labels and keyboard-friendly controls.

## 18.3 Mobile and connectivity

- Prioritise essential actions.
- Avoid unnecessarily heavy screens.
- Keep forms manageable.
- Handle slow network requests.
- Provide clear retry states.
- Avoid assuming a stable realtime connection.

---

# 19. Backend Implementation Roadmap

Backend work should be staged. Do not attempt to implement every feature in one large migration or one uncontrolled integration.

## Phase 1 — Backend foundation

- Create or configure the Supabase project.
- Confirm environment configuration.
- Connect the existing Supabase client.
- Establish migration conventions.
- Define database naming conventions.
- Configure local and production environments.
- Establish secure key handling.
- Document deployment configuration.

**Acceptance:** The frontend can safely connect to the intended Supabase environment without exposing privileged credentials.

## Phase 2 — Identity and profiles

- Implement Supabase Auth.
- Implement profile creation and retrieval.
- Connect login and registration.
- Handle sessions and sign-out.
- Handle authentication loading and error states.
- Ensure user-owned profile access.
- Implement the distinction between individual and organisation contexts.

**Acceptance:** A real user can register, sign in, sign out and access only their permitted profile data.

## Phase 3 — Roles and organisations

- Implement personal role assignments.
- Implement organisation records.
- Implement organisation membership.
- Support multiple organisations per user.
- Support different roles in different organisations.
- Enforce organisation access.

**Acceptance:** A user can operate in the correct personal or organisation context without receiving unauthorised access.

## Phase 4 — Verification

- Implement verification submissions.
- Implement evidence metadata and private storage.
- Implement review states.
- Implement authorised review actions.
- Enforce trading restrictions.
- Implement rejection reasons and resubmission rules.

**Acceptance:** An unverified user cannot publish or negotiate through direct API requests, even if they bypass the frontend.

## Phase 5 — Commodity catalogue

- Create reference catalogue records.
- Support categories and varieties.
- Support custom crop names in operational records.
- Preserve the distinction between catalogue references and user-entered crops.
- Implement controlled catalogue management.

**Acceptance:** Users can list supported catalogue crops and custom crops without corrupting reference data.

## Phase 6 — Supply and demand

- Implement supply persistence.
- Implement demand persistence.
- Connect create, read, update and status workflows.
- Enforce ownership and organisation permissions.
- Implement unit and conversion validation.
- Ensure users cannot alter records they do not control.

**Acceptance:** Supply and demand records persist correctly and are accessible only according to approved visibility and ownership rules.

## Phase 7 — Matching

- Move matching to a trusted, consistent execution path.
- Preserve the approved deterministic rules.
- Validate source records before evaluation.
- Preserve hard eligibility exclusions.
- Handle unknown data honestly.
- Decide whether results are calculated on demand or persisted.
- Test partial fulfilment and unit conversions.

**Acceptance:** Matching results are reproducible, explainable and based on actual eligible records.

## Phase 8 — Enquiries and messaging

- Implement conversation creation.
- Implement conversation participants.
- Implement persistent messages.
- Implement message access policies.
- Implement unread state.
- Implement attachment handling if approved.
- Add realtime delivery only after persistence and authorisation work correctly.

**Acceptance:** Two authorised participants can access the same persistent conversation without exposing it to unrelated users.

## Phase 9 — Negotiation and agreements

- Implement offer creation.
- Preserve offer history.
- Implement counteroffers.
- Implement offer status transitions.
- Implement acceptance and rejection.
- Create agreement records transactionally.
- Preserve accepted terms as a snapshot.
- Prevent conflicting acceptance actions.

**Acceptance:** An agreement can only be created through a valid accepted offer, and the historical negotiation remains available.

## Phase 10 — Payment and delivery status

- Implement status tracking only where approved.
- Keep payment and delivery independent.
- Do not implement escrow in this MVP.
- Do not claim funds have moved without a real integrated payment provider.

**Acceptance:** The platform accurately represents agreement, payment and delivery states without implying unsupported financial functionality.

## Phase 11 — Notifications

- Define real notification events.
- Implement recipient-specific notifications.
- Implement read/unread state.
- Trigger notifications from authorised backend events.
- Test that users cannot read another user's notifications.

**Acceptance:** Notifications correspond to actual events and are visible only to their intended recipients.

## Phase 12 — Testing, security and deployment

- Test authentication.
- Test RLS.
- Test ownership boundaries.
- Test organisation membership.
- Test verification restrictions.
- Test supply and demand permissions.
- Test matching rules.
- Test conversation privacy.
- Test offer and agreement transitions.
- Test file access.
- Test error and offline states.
- Deploy to the approved environment.
- Verify production configuration.

**Acceptance:** The core workflows work against persistent data, and the critical access-control rules pass tests.

---

# 20. Testing Requirements

Testing must cover more than whether the frontend builds.

## 20.1 Authentication

- New user registration.
- Existing user login.
- Invalid credentials.
- Session restoration.
- Sign-out.
- Protected route access.

## 20.2 Organisation permissions

- User with no organisation.
- User belonging to one organisation.
- User belonging to multiple organisations.
- User with different roles in different organisations.
- Member attempting an unauthorised organisation action.

## 20.3 Verification

- Unverified user.
- Pending verification.
- Approved verification.
- Rejected verification.
- Resubmission.
- Direct API attempt to publish while unverified.

## 20.4 Supply and demand

- Catalogue crop.
- Custom crop.
- Unknown variety.
- Missing optional information.
- Explicit quantity units.
- Known package conversion.
- Unknown package conversion.
- Partial quantity compatibility.
- Ownership and permission boundaries.

## 20.5 Matching

- Exact catalogue commodity match.
- Exact custom crop-name match.
- Catalogue/custom mismatch.
- Quality exclusion.
- Unknown quality.
- Variety preference.
- Unknown variety.
- Partial fulfilment.
- Ineligible supply status.
- Ineligible demand status.
- Unknown location or delivery timing.

## 20.6 Messaging and negotiation

- Conversation privacy.
- Message persistence.
- Unread state.
- Offer creation.
- Counteroffer history.
- Offer rejection.
- Offer acceptance.
- Duplicate acceptance prevention.
- Agreement snapshot.
- Unauthorised conversation access.

## 20.7 Payment and delivery

- Agreement without payment.
- Payment status independent of delivery.
- Delivery status independent of payment.
- No false escrow confirmation.
- No false payment completion.

---

# 21. Explicit MVP Exclusions

The following are not approved as MVP functionality:

- AI-powered matching.
- AI deciding which users should trade.
- Automated escrow.
- RiceLink holding customer funds.
- A built-in wallet.
- Automated payment processing.
- Lending.
- Insurance.
- A full logistics marketplace.
- Route optimisation.
- Assumed ownership of farms, warehouses, trucks or inventory.
- Guaranteed quality or delivery.
- Unverified market-price claims.
- Unverified distance or travel-time estimates.
- Automatic approval of verification evidence.
- Treating a compatibility score as a guarantee.

Transportation information may be captured as part of coordination.

It must not automatically become a logistics marketplace.

Future expansion should be evidence-driven.

---

# 22. Decisions Still Requiring Confirmation

The following areas should be explicitly resolved before the relevant backend tables, policies or workflows are finalised.

| Area | Outstanding decision |
|---|---|
| Account identity | Final email/phone verification and recovery workflow |
| Organisation membership | Invitation, acceptance and removal workflow |
| Organisation authority | Exact membership permissions and administrative roles |
| Verification | Accepted evidence criteria and reviewer authority |
| Verification retention | Evidence retention and deletion policy |
| Listing visibility | Exact public, authenticated and private visibility rules |
| Listing lifecycle | Full supply and demand status transitions |
| Quantity | Final supported unit catalogue and conversion governance |
| Custom crops | Catalogue review and standardisation workflow |
| Matching | On-demand calculation versus persisted match results |
| Matching refresh | When matching is recalculated |
| Conversations | Who may initiate an enquiry and under what conditions |
| Offers | Whether multiple pending offers can exist simultaneously |
| Offer expiry | Whether expiry is required and how it is enforced |
| Agreement | Whether additional confirmation or signing is required |
| Attachments | Allowed file types, size limits and access rules |
| Notifications | In-app only or additional channels |
| Payment | Future payment-provider and regulatory requirements |
| Disputes | Future dispute workflow and responsible authority |

Do not silently choose answers to these questions during implementation.

Record approved answers here before building the relevant functionality.

---

# 23. Current Project State

The current frontend is implemented with React, TypeScript, Vite and Tailwind CSS v4.

The existing project has working pages for:

- Landing page.
- Registration and login interfaces.
- Dashboard.
- Commodity catalogue.
- Supply management.
- Demand management.
- Compatibility matching.
- Messaging and negotiation demonstration.

The messaging page now supports a local demonstration of:

- Conversation selection.
- Message composition.
- Structured offers.
- Counteroffers.
- Offer acceptance and rejection.
- Agreement summaries.
- Payment and delivery status display.
- Escrow-unavailable messaging.

These actions currently update local frontend state only.

They do not create persistent backend records or send messages to other users.

## 23.1 Build verification

The latest reported production build succeeded:

```text
vite v8.3.8 building client environment for production...
✓ 2205 modules transformed.

dist/index.html                   1.22 kB
dist/assets/index-7QXaEiEp.css   60.70 kB
dist/assets/index-Cqj_jtLH.js   493.77 kB

✓ built in 5.44s
```

This confirms the frontend compiles. It does not confirm backend functionality because the backend has not yet been integrated.

---

# 24. Instructions for Future Implementation

Before implementing a backend feature:

1. Read this document.
2. Inspect the current source code and relevant TypeScript types.
3. Identify the exact frontend workflow the backend must support.
4. Identify the relevant entities and relationships.
5. Define ownership and authorisation rules.
6. Define validation and status transitions.
7. Identify whether the operation needs a database transaction or privileged function.
8. Review the migration and RLS implications.
9. Implement only the approved scope.
10. Test the feature against real database records.
11. Update this document when a significant decision changes.
12. Report completed work and remaining limitations.

Never generate a database schema from mock data alone.

Never assume that a field in a frontend form is automatically a required database field.

Never assume that hiding a frontend action makes it secure.

Never replace an approved business rule with a simpler implementation without approval.

---

# 25. Final Product Principle

RiceLink should be built around reliable agricultural information, clear participant identity, controlled access, transparent matching and structured coordination.

The platform should help people discover and negotiate opportunities without pretending to guarantee what it cannot verify.

The backend must preserve these principles.

**Build the foundation correctly. Keep the workflows understandable. Protect participants and their data. Expand only when the product and evidence justify it.**

---

**End of document — RiceLink Product, Architecture & Backend Implementation Handover**