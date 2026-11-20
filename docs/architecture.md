RiceLink — System Architecture
Document: System ArchitectureSystem: RiceLink Agricultural Supply-Chain Coordination PlatformVersion: 1.0Status: Proposed ArchitectureDate: November 2026

1. Introduction
1.1 Purpose
This document defines the proposed technical architecture for RiceLink.
RiceLink is being designed as a multi-crop agricultural supply-chain coordination platform from the beginning.
The architecture must support different agricultural commodities, participant categories, supply and demand workflows, aggregation, storage, logistics and future agricultural intelligence capabilities.
The document establishes the system's major components, technical boundaries, logical data model, application modules, security principles and implementation approach.
1.2 Architectural Vision
RiceLink should be built as a modular, scalable and data-driven application.
The system must allow new crops, participant roles, geographic locations and agricultural services to be introduced without fundamental redesign.
The initial architecture should remain simple enough for an early-stage development team to build and maintain.
Recommended architectural approach: Modular Monolith with clearly separated domain modules.
Microservices are not recommended for the initial implementation because they introduce unnecessary infrastructure and operational complexity before the product has demonstrated the need for independent service deployment.

2. Architecture Principles
2.1 Multi-Crop by Design
Crops must be represented through a central crop catalogue.
The system must not use separate hard-coded database structures for rice, maize, cassava or other crops.
2.2 Multi-Stakeholder Architecture
The system must support multiple participant types through a shared account and permission model.
2.3 Modular Design
Business domains should be separated into logical modules with clear responsibilities.
2.4 Data Integrity
The system must preserve relationships between users, organisations, crops, listings, procurement requests and commercial coordination records.
2.5 Security by Design
Authentication, authorisation and privacy must be considered at every layer.
2.6 Incremental Development
The architecture should support phased implementation without requiring every planned feature to be available at launch.
2.7 Configurability
Crop attributes, participant roles, units and relevant platform settings should be configurable where practical.
2.8 Simplicity
Prefer reliable, understandable solutions over unnecessary architectural complexity.

3. High-Level System Architecture
                         RICELINK USERS

  Producers | Aggregators | Processors | Buyers
  Storage Providers | Logistics Operators | Administrators

                              |
                              |
                              v

                 RESPONSIVE WEB APPLICATION

  -------------------------------------------------------
  Authentication | Onboarding | Dashboards
  Supply | Procurement | Discovery | Matching
  Enquiries | Aggregation | Storage | Logistics
  Administration | Analytics
  -------------------------------------------------------

                              |
                              |
                              v

                   APPLICATION / API LAYER

  -------------------------------------------------------
  Identity & Access Module
  Organisation Management Module
  Crop Catalogue Module
  Supply Management Module
  Procurement Management Module
  Search & Discovery Module
  Matching Module
  Enquiry & Coordination Module
  Administration Module

  Future Modules:
  Aggregation | Deals | Storage | Logistics
  Analytics | Notifications
  -------------------------------------------------------

                              |
                              |
               -------------------------------
               |                             |
               v                             v

       RELATIONAL DATABASE             FILE STORAGE

       Users                           Produce Images
       Organisations                   Profile Images
       Roles                           Documents
       Crops
       Supply Listings
       Procurement Requests
       Enquiries
       Audit Records

               |
               |
               v

           EXTERNAL INTEGRATIONS

       Email / SMS / Notifications
       Maps / Geolocation
       Payment Providers
       Logistics Partners
       Warehouse Systems
       Agricultural Data Providers

4. Recommended Technology Architecture
The final technology stack should be selected according to the engineering team's experience, available resources and deployment requirements.
The following is a recommended starting point.
Layer
Recommended Technology
Purpose
Frontend
React with TypeScript
Web application
Build Tool
Vite
Development and production builds
Styling
Tailwind CSS
Responsive interface development
UI Components
Reusable component system
Consistent interface
Backend
TypeScript API or managed backend services
Application business logic
Database
PostgreSQL
Relational data storage
Authentication
Established authentication provider
Secure identity management
File Storage
Private object storage
Images and documents
Validation
Zod or equivalent
Input and schema validation
API Communication
REST or typed RPC
Client-server communication
Testing
Vitest and Playwright or equivalents
Unit and end-to-end testing
Hosting
Managed application hosting
Deployment
Monitoring
Error tracking and structured logs
Operational visibility
Technology Decision
If the team chooses Supabase, it can provide:
PostgreSQL database.
Authentication.
Row-level security.
Object storage.
Edge Functions.
Database migrations.
However, privileged operations and important business rules should remain within trusted server-side services.
The frontend must not be trusted to enforce security independently.

5. Application Modules
5.1 Identity and Access Management
Responsible for:
User registration.
Authentication.
User profiles.
Organisation profiles.
Organisation memberships.
Participant roles.
Permissions.
Account status.
Verification status.
Important Design Decision
A user must not be restricted to a single agricultural role.
For example, an organisation may operate as both an aggregator and a buyer.
The permission system should support multiple roles without creating duplicate accounts unnecessarily.
5.2 Organisation Management
Responsible for:
Organisation creation.
Organisation profiles.
Membership.
Member permissions.
Organisation verification.
Organisation-level activities.
An organisation may have multiple members with different permissions.
5.3 Crop Catalogue Management
This is one of the most important modules in the RiceLink architecture.
It provides the shared agricultural product reference used across the platform.
Responsibilities
Crop categories.
Crop records.
Crop descriptions.
Crop activation status.
Crop varieties, where supported.
Units of measurement.
Crop-specific attributes.
Example Structure
Crop Categories
|
|-- Grains
|    |-- Rice
|    |-- Maize
|    |-- Sorghum
|    |-- Millet
|
|-- Legumes
|    |-- Soybeans
|    |-- Cowpeas
|    |-- Groundnuts
|
|-- Roots and Tubers
|    |-- Cassava
|    |-- Yam
|    |-- Potatoes
|
|-- Fruits and Vegetables
|    |-- Tomatoes
|    |-- Pepper
|    |-- Onions
|    |-- Plantain
|
|-- Cash Crops
     |-- Cocoa
     |-- Cashew
     |-- Sesame
This catalogue must be dynamic.
Adding a new crop should not require creating a new database table or rewriting the supply module.
5.4 Supply Management
Responsible for:
Creating supply listings.
Updating supply listings.
Managing listing availability.
Managing listing status.
Quantity validation.
Crop attribute validation.
Supply discovery.
Core Supply Data
Supply Listing
    |
    |-- Owner
    |-- Organisation
    |-- Crop
    |-- Quantity
    |-- Unit
    |-- Location
    |-- Availability
    |-- Crop Attributes
    |-- Description
    |-- Images
    |-- Status
    |-- Created At
    |-- Updated At
5.5 Procurement Management
Responsible for:
Creating procurement requests.
Managing required quantities.
Managing crop specifications.
Managing delivery locations.
Managing procurement periods.
Updating request status.
Core Procurement Data
Procurement Request
    |
    |-- Request Owner
    |-- Organisation
    |-- Crop
    |-- Required Quantity
    |-- Unit
    |-- Required Location
    |-- Required Period
    |-- Quality Requirements
    |-- Crop Attributes
    |-- Description
    |-- Status
5.6 Search and Discovery
Responsible for discovering:
Available produce.
Expected produce.
Procurement requests.
Agricultural service providers.
Storage services.
Logistics services.
The search module should support filters based on crop, location, quantity, status and availability.
5.7 Matching Engine
Responsible for identifying potential supply-demand relationships.
Initial Matching Logic
The first version should use deterministic rules.
Matching factors:
Crop.
Quantity.
Unit compatibility.
Location.
Availability period.
Quality requirements.
Variety requirements.
Important Considerations
A matching result must not automatically:
Reserve supply.
Create an order.
Confirm a sale.
Guarantee delivery.
The matching engine should provide useful suggestions and allow participants to initiate enquiries.
Advanced AI-based matching should only be considered when sufficient reliable data exists.
5.8 Enquiry and Coordination
Responsible for:
Enquiry creation.
Enquiry ownership.
Enquiry recipients.
Enquiry status.
Notification triggers.
Coordination history.
Enquiries should be linked to the relevant supply listing, procurement request or service.
5.9 Aggregation Management
Responsible for:
Aggregation lots.
Source contributions.
Consolidated quantities.
Quantity allocation.
Remaining supply.
Aggregation status.
Important Design Consideration
An aggregation lot must maintain references to the original supply sources.
The system must prevent or flag double allocation of the same produce quantity.
5.10 Storage Coordination
Responsible for:
Storage provider profiles.
Facility information.
Storage types.
Declared capacity.
Supported commodities.
Storage enquiries.
Storage coordination status.
RiceLink should initially coordinate access to third-party facilities rather than assume ownership of storage infrastructure.
5.11 Logistics Coordination
Responsible for:
Logistics provider profiles.
Service coverage.
Vehicle information.
Transportation requests.
Pickup and destination information.
Delivery coordination.
Transport request status.
5.12 Administration and Moderation
Responsible for:
User management.
Organisation management.
Crop catalogue management.
Unit management.
Verification.
Content moderation.
Reports.
Audit records.
Platform configuration.

6. Database Architecture
6.1 Database Approach
A relational database is recommended because RiceLink involves many connected entities and relationships.
PostgreSQL is a suitable choice.
The database should preserve relationships between users, organisations, crops, supply records, procurement requests and enquiries.
6.2 Core Database Entities
USERS
Stores individual user account information.
users
-----
id
auth_user_id
full_name
email
phone
account_status
created_at
updated_at
Authentication credentials should be managed by the selected authentication provider rather than stored directly in this table.
ORGANISATIONS
organisations
-------------
id
name
organisation_type
description
location_id
verification_status
created_at
updated_at
ORGANISATION_MEMBERS
organisation_members
--------------------
id
organisation_id
user_id
membership_role
status
created_at
ROLES
roles
-----
id
name
description
Suggested roles:
Producer.
Aggregator.
Processor.
Storage Provider.
Logistics Operator.
Buyer.
Administrator.
USER_ROLES
user_roles
----------
id
user_id
role_id
organisation_id
created_at
The organisation reference may be nullable for individual roles.
CROP_CATEGORIES
crop_categories
---------------
id
name
description
created_at
CROPS
crops
-----
id
category_id
name
description
is_active
created_at
updated_at
UNITS_OF_MEASUREMENT
units_of_measurement
--------------------
id
name
symbol
measurement_type
is_active
Examples:
Kilogram.
Tonne.
Gram.
Bag.
Crate.
Basket.
Litre.
Important: Units such as bags, crates and baskets may have variable capacities. The system must not assume a universal conversion unless the quantity basis is explicitly defined.
CROP_ATTRIBUTE_DEFINITIONS
crop_attribute_definitions
--------------------------
id
crop_id
attribute_key
label
data_type
unit_id
is_required
validation_config
created_at
Examples:
Moisture content.
Variety.
Grade.
Packaging type.
Harvest condition.
LOCATIONS
locations
---------
id
country
state
lga
town
address
latitude
longitude
created_at
Latitude and longitude may be optional initially.
SUPPLY_LISTINGS
supply_listings
---------------
id
owner_user_id
organisation_id
crop_id
quantity
unit_id
supply_type
location_id
available_from
available_until
status
description
created_at
updated_at
SUPPLY_ATTRIBUTE_VALUES
supply_attribute_values
-----------------------
id
supply_listing_id
attribute_definition_id
value
PROCUREMENT_REQUESTS
procurement_requests
--------------------
id
owner_user_id
organisation_id
crop_id
required_quantity
unit_id
location_id
required_from
required_until
status
description
created_at
updated_at
PROCUREMENT_ATTRIBUTE_VALUES
procurement_attribute_values
----------------------------
id
procurement_request_id
attribute_definition_id
value
ENQUIRIES
enquiries
---------
id
target_type
target_id
initiated_by_user_id
recipient_user_id
message
status
created_at
updated_at
For stronger relational integrity, the implementation may use separate enquiry reference tables or a different target-reference design instead of relying solely on a polymorphic target ID.
AUDIT_EVENTS
audit_events
------------
id
actor_user_id
entity_type
entity_id
action
metadata
created_at
6.3 Future Database Entities
The following entities should be introduced as the related modules are implemented:
deals
deal_participants

aggregation_lots
aggregation_contributions

storage_facilities
storage_services
storage_requests

logistics_services
transport_requests

notifications

verification_requests

moderation_reports
moderation_actions

attachments

7. Important Database Design Decisions
7.1 Avoid Crop-Specific Tables
Do not create:
rice_listings
maize_listings
cassava_listings
yam_listings
Instead, use:
supply_listings
    |
    |-- crop_id
This allows every supported crop to use the same supply-management system.
7.2 Use Configurable Crop Attributes
Different crops require different information.
The system should not force every crop to use the same fields.
For example:
Rice may require moisture content and variety.
Cassava may require fresh/dried form and harvest date.
Tomatoes may require maturity and packaging information.
Crop-specific attributes should therefore be configurable.
7.3 Use Explicit Measurement Units
A quantity must always be stored alongside its unit.
For example:
Quantity: 5
Unit: Tonnes
Do not assume that five bags, five baskets and five tonnes represent equivalent quantities.
Conversions should only occur when a valid conversion basis exists.
7.4 Separate Supply and Demand
Supply listings and procurement requests represent different business concepts.
They should have separate records and validation rules.
7.5 Preserve Ownership
Every supply listing and procurement request must identify its owner.
Organisation-owned records must also reference the relevant organisation.
7.6 Preserve Traceability
When aggregation is introduced, consolidated produce must retain references to its original sources.

8. Application Information Architecture
The frontend should provide navigation appropriate to each user's roles.
Shared Navigation
Dashboard.
Explore Supply.
Explore Demand.
Enquiries.
Profile.
Organisation Settings.
Producer Navigation
My Supply.
Create Supply Listing.
Supply Activity.
Enquiries Received.
Aggregator Navigation
Discover Supply.
Aggregation Lots.
My Supply.
Enquiries.
Buyer Opportunities.
Processor Navigation
Procurement Requests.
Create Procurement Request.
Discover Supply.
Enquiries.
Buyer Navigation
My Procurement Requests.
Explore Supply.
Enquiries.
Storage Provider Navigation
Storage Services.
Facilities.
Storage Enquiries.
Logistics Operator Navigation
Logistics Services.
Transport Requests.
Enquiries.
Administrator Navigation
Platform Overview.
Users.
Organisations.
Crop Catalogue.
Units of Measurement.
Supply Listings.
Procurement Requests.
Reports.
Verification.
Moderation.
Audit Activity.
Navigation should be role-aware. A user with multiple roles should be able to access all permitted functions without needing separate accounts.

9. API Architecture
The backend should expose clear application operations through REST endpoints or an equivalent typed API.
The following is an illustrative REST structure.
Authentication and Profiles
GET    /me
PATCH  /me

POST   /organisations
GET    /organisations
GET    /organisations/{id}
PATCH  /organisations/{id}
Crop Catalogue
GET    /crops
GET    /crops/{id}

GET    /crop-categories
GET    /units
Administrative operations:
POST   /admin/crops
PATCH  /admin/crops/{id}
DELETE /admin/crops/{id}
Deactivation is generally preferable to deleting crops referenced by historical records.
Supply
POST   /supply-listings
GET    /supply-listings
GET    /supply-listings/{id}
PATCH  /supply-listings/{id}
POST   /supply-listings/{id}/close
Procurement
POST   /procurement-requests
GET    /procurement-requests
GET    /procurement-requests/{id}
PATCH  /procurement-requests/{id}
POST   /procurement-requests/{id}/close
Discovery and Matching
GET    /search
GET    /matches
Enquiries
POST   /enquiries
GET    /enquiries
GET    /enquiries/{id}
PATCH  /enquiries/{id}
Future Endpoints
POST   /aggregation-lots
GET    /aggregation-lots

POST   /storage-services
GET    /storage-services

POST   /transport-requests
GET    /transport-requests
All endpoints must validate input, authenticate users where required and enforce server-side permissions.

10. Security Architecture
10.1 Authentication
Use an established authentication provider.
Do not implement password storage or session security from scratch unless there is a compelling, reviewed reason.
10.2 Authorisation
The backend must enforce:
User ownership.
Organisation membership.
Participant roles.
Administrative permissions.
Record visibility.
Hiding frontend buttons is not sufficient security.
10.3 Database Security
If PostgreSQL row-level security is used:
Enable RLS on exposed tables.
Create explicit SELECT policies.
Create explicit INSERT policies.
Create explicit UPDATE policies.
Create explicit DELETE policies where deletion is permitted.
Test allowed and denied access paths.
Restrict privileged service credentials to trusted backend environments.
10.4 File Security
Uploaded files should:
Have permitted file types.
Have configured size limits.
Be stored securely.
Be associated with authorised records.
Have access policies appropriate to their content.
Verification documents should not be publicly accessible.
10.5 Privacy
The system should protect:
Phone numbers.
Email addresses.
Organisation documents.
Private enquiries.
Commercial terms.
Sensitive account information.

11. Matching Engine Architecture
The first matching engine should be rule-based.
11.1 Matching Process
Supply Listing
      |
      v
Validate Listing Status
      |
      v
Identify Active Procurement Requests
      |
      v
Compare Crop
      |
      v
Check Unit Compatibility
      |
      v
Compare Quantity
      |
      v
Evaluate Location
      |
      v
Evaluate Availability Period
      |
      v
Evaluate Quality Requirements
      |
      v
Return Potential Matches
11.2 Matching Considerations
Crop Compatibility
The supply and demand records must refer to the same compatible crop.
Quantity Compatibility
The system must compare quantities only where their units are compatible.
Location Compatibility
The system should consider the distance or geographic relationship between the supply location and required delivery location.
Time Compatibility
The expected supply period should overlap with the procurement period sufficiently to be relevant.
Quality Compatibility
Where quality requirements are specified, the system should compare them against available supply information.
Missing information must not be silently treated as a successful match.
11.3 Future Matching Improvements
Possible future capabilities:
Geographic distance ranking.
Historical supplier reliability.
Response-time information.
Quality compatibility scoring.
Supply forecasting.
Demand forecasting.
Intelligent recommendations.
These enhancements depend on reliable data and validated user needs.

12. Notification Architecture
The system may eventually support:
Email notifications.
SMS notifications.
In-app notifications.
Push notifications.
Initial notification events should include:
New enquiry.
Enquiry response.
Listing status change.
Procurement request update.
Verification update.
Notifications should respect user preferences and privacy rules.

13. Deployment Architecture
The application should maintain separate environments.
Development
Used for:
Feature development.
Local testing.
Schema experimentation.
Integration testing.
Staging
Used for:
Pre-production testing.
Acceptance testing.
Pilot preparation.
Release verification.
Production
Used for:
Actual users.
Live agricultural listings.
Real procurement activity.
Production records.
Deployment Requirements
Separate environment credentials.
Version-controlled migrations.
Secure environment variables.
Automated build checks.
Automated tests.
Database backups.
Recovery procedures.
Error monitoring.
Destructive database changes must not be tested directly against production data.

14. Testing Architecture
Unit Testing
Test:
Crop validation.
Unit validation.
Quantity handling.
Matching logic.
Role permissions.
Listing status transitions.
Procurement status transitions.
Integration Testing
Test:
Authentication.
Organisation management.
Crop catalogue.
Supply publication.
Procurement publication.
Search.
Matching.
Enquiry workflows.
Database access policies.
End-to-End Testing
Test complete user journeys:
Producer registers and publishes agricultural supply.
Buyer registers and publishes procurement demand.
Buyer discovers relevant supply.
Producer receives and responds to an enquiry.
Aggregator coordinates supply from multiple producers.
Storage provider publishes a service.
Logistics provider responds to a transportation request.
Administrator reviews a reported listing.
Security Testing
Test:
Unauthorised access.
Cross-user record access.
Cross-organisation record access.
Privilege escalation.
Invalid uploads.
Input manipulation.
Access-control bypass.

15. Implementation Phases
Phase 0 — Foundation and System Setup
Objectives:
Establish the project structure.
Configure development environments.
Establish database and authentication.
Define coding conventions.
Establish migration strategy.
Define the permission model.
Establish testing and deployment workflows.
Deliverable: A functioning technical foundation.
Phase 1 — Identity and Agricultural Foundation
Build:
Authentication.
User profiles.
Organisation profiles.
Participant roles.
Crop catalogue.
Crop categories.
Units of measurement.
Crop-specific attributes.
Deliverable: A functioning multi-crop platform foundation.
Phase 2 — Supply and Demand
Build:
Supply management.
Procurement management.
Listing status management.
Crop-aware forms.
Quantity and unit validation.
Location management.
Deliverable: Producers can publish supply, and buyers can publish demand.
Phase 3 — Discovery and Coordination
Build:
Search.
Filtering.
Rule-based matching.
Enquiries.
Contact workflows.
Notifications.
Deliverable: Participants can discover opportunities and coordinate enquiries.
Phase 4 — Extended Supply-Chain Coordination
Build:
Aggregation lots.
Storage provider profiles.
Storage enquiries.
Logistics provider profiles.
Transport requests.
Deal/order records where approved.
Deliverable: More complete agricultural supply-chain coordination workflows.
Phase 5 — Intelligence and Integrations
Build selectively:
Analytics.
Agricultural market information.
Supply and demand intelligence.
Advanced matching.
External integrations.
Forecasting where sufficient data exists.
Deliverable: An increasingly data-driven agricultural coordination platform.

16. Technical Risks
Risk
Mitigation
Crop-specific assumptions enter the architecture
Use a configurable crop catalogue and shared supply/demand models
Different units cause inaccurate matches
Explicit units and controlled conversions
Role complexity creates security vulnerabilities
Central permission model and access-control testing
Aggregation causes duplicate supply allocation
Source traceability and allocation rules
Poor listing information reduces trust
Validation, expiry and reporting
Too many features delay launch
Phased development and clear release priorities
Premature microservices increase complexity
Begin with a modular monolith
Premature AI increases costs
Start with transparent rule-based matching

17. Architecture Decisions Requiring Team Approval
Before implementation begins, the team should approve:
Frontend technology.
Backend technology.
Database technology.
Authentication provider.
Organisation and role model.
Crop catalogue design.
Crop attribute configuration strategy.
Measurement unit strategy.
Location data structure.
Matching methodology.
File storage approach.
Notification approach.
Deployment environments.
Testing strategy.

18. Definition of Architecture Readiness
The architecture is ready for implementation when:
The team understands the platform's major modules.
The multi-crop data model is approved.
Participant roles and permissions are defined.
Supply and procurement workflows are documented.
Measurement units and crop attributes are understood.
The database entities and relationships are approved.
Security responsibilities are defined.
The first-release scope is agreed.
The implementation phases are accepted.

19. Final Architectural Direction
RiceLink should be developed as a modular, multi-crop agricultural supply-chain coordination platform.
Its foundation must support agricultural products, participants and commercial coordination activities without depending on any single crop.
The initial implementation should prioritise:
Identity and organisation management.
Multi-crop catalogue.
Agricultural supply.
Procurement demand.
Discovery and matching.
Enquiry and coordination.
Aggregation, storage, logistics, advanced analytics and integrations should be introduced progressively.
The architecture should make RiceLink capable of supporting the wider agricultural ecosystem while keeping the first implementation focused, maintainable and practical to deliver.
