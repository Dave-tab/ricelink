-- ====================================================================
-- RiceLink Agricultural Supply-Chain Coordination Platform
-- Migration: 20261120000000_initial_schema.sql
-- Description: Core relational schema, multi-crop catalogue,
--              explicit measurement rules, supply, demand,
--              inquiries, and Row Level Security (RLS).
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. PROFILES & PARTICIPANTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 2. ORGANIZATIONS & MEMBERSHIPS (Multi-Stakeholder Architecture)
-- ====================================================================
CREATE TYPE organization_type AS ENUM (
    'cooperative',
    'aggregator',
    'processor',
    'buyer',
    'storage_operator',
    'logistics_provider'
);

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    org_type organization_type NOT NULL,
    registration_number TEXT,
    state TEXT NOT NULL,
    lga TEXT NOT NULL,
    headquarters_address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE member_role AS ENUM ('owner', 'admin', 'manager', 'member');

CREATE TABLE IF NOT EXISTS public.organization_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role member_role DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, profile_id)
);

-- ====================================================================
-- 3. MULTI-CROP CATALOGUE & EXPLICIT MEASUREMENT UNITS
-- ====================================================================
CREATE TYPE crop_category AS ENUM (
    'Grains',
    'Legumes',
    'Roots & Tubers',
    'Cash Crops',
    'Fruits & Vegetables'
);

CREATE TABLE IF NOT EXISTS public.commodities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    category crop_category NOT NULL,
    description TEXT,
    max_moisture_content NUMERIC(4,2), -- e.g. 13.50%
    seasonal_peak TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.commodity_varieties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(commodity_id, name)
);

CREATE TABLE IF NOT EXISTS public.commodity_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(commodity_id, code)
);

CREATE TABLE IF NOT EXISTS public.units_of_measure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- e.g. '50kg Bag', '100kg Jute Bag', 'Metric Tonne (MT)'
    symbol TEXT NOT NULL,       -- e.g. '50kg', '100kg', 'MT'
    kg_conversion_factor NUMERIC(10,3) NOT NULL, -- e.g. 50.000, 100.000, 1000.000
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Controlled conversion rules per commodity
CREATE TABLE IF NOT EXISTS public.commodity_unit_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.units_of_measure(id) ON DELETE CASCADE,
    kg_override NUMERIC(10,3), -- allows crop-specific overrides if applicable
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE(commodity_id, unit_id)
);

-- ====================================================================
-- 4. SUPPLY MANAGEMENT (Harvest Batches & Physical Produce)
-- ====================================================================
CREATE TYPE supply_batch_status AS ENUM (
    'draft',
    'verified',
    'in_aggregation',
    'inspected',
    'allocated',
    'closed'
);

CREATE TABLE IF NOT EXISTS public.supply_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_code TEXT UNIQUE NOT NULL,
    owner_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE RESTRICT,
    variety_id UUID REFERENCES public.commodity_varieties(id) ON DELETE SET NULL,
    variety_name TEXT NOT NULL,
    
    -- Explicit measurement
    quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
    unit_id UUID NOT NULL REFERENCES public.units_of_measure(id) ON DELETE RESTRICT,
    metric_tonnes NUMERIC(12,3) NOT NULL CHECK (metric_tonnes > 0),
    
    grade TEXT DEFAULT 'Standard Commercial',
    moisture_content NUMERIC(4,2),
    packaging TEXT,
    
    -- Location
    state TEXT NOT NULL,
    lga TEXT NOT NULL,
    facility_name TEXT NOT NULL,
    
    asking_price_per_mt NUMERIC(12,2),
    status supply_batch_status DEFAULT 'verified',
    harvest_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. PROCUREMENT DEMAND (Buyer Tenders & Raw Material Orders)
-- ====================================================================
CREATE TYPE tender_status AS ENUM (
    'draft',
    'open',
    'evaluating',
    'partially_matched',
    'fulfilled',
    'closed'
);

CREATE TABLE IF NOT EXISTS public.procurement_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_code TEXT UNIQUE NOT NULL,
    buyer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE RESTRICT,
    
    required_quantity_mt NUMERIC(12,3) NOT NULL CHECK (required_quantity_mt > 0),
    accepted_moisture_max NUMERIC(4,2),
    grade_requirement TEXT DEFAULT 'Standard Industrial',
    variety_preferences TEXT[] DEFAULT '{}',
    
    delivery_state TEXT NOT NULL,
    delivery_lga TEXT,
    receiving_hub TEXT NOT NULL,
    
    target_delivery_date DATE NOT NULL,
    target_price_per_mt NUMERIC(12,2),
    status tender_status DEFAULT 'open',
    posted_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 6. INQUIRIES & BILATERAL NEGOTIATION DESK
-- ====================================================================
CREATE TYPE milestone_stage AS ENUM (
    'inquiry_initiated',
    'sample_tested',
    'terms_proposed',
    'logistics_staged',
    'contract_executed',
    'completed'
);

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_code TEXT UNIQUE NOT NULL,
    supply_listing_id UUID REFERENCES public.supply_listings(id) ON DELETE SET NULL,
    procurement_request_id UUID REFERENCES public.procurement_requests(id) ON DELETE SET NULL,
    initiator_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    recipient_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    commodity_summary TEXT NOT NULL,
    quantity_summary TEXT NOT NULL,
    current_milestone milestone_stage DEFAULT 'inquiry_initiated',
    agreed_price_per_mt NUMERIC(12,2),
    is_closed BOOLEAN DEFAULT FALSE,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inquiry_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    sender_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    message_text TEXT NOT NULL,
    message_type TEXT DEFAULT 'chat', -- 'chat', 'terms', 'milestone'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. DETERMINISTIC CALCULATION FUNCTION (Bags to MT)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.calculate_metric_tonnes(
    p_quantity NUMERIC,
    p_unit_id UUID
) RETURNS NUMERIC AS $$
DECLARE
    v_kg_factor NUMERIC;
BEGIN
    SELECT kg_conversion_factor INTO v_kg_factor
    FROM public.units_of_measure
    WHERE id = p_unit_id;

    IF v_kg_factor IS NULL THEN
        RETURN p_quantity; -- fallback if direct MT
    END IF;

    RETURN (p_quantity * v_kg_factor) / 1000.0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units_of_measure ENABLE ROW LEVEL SECURITY;

-- Public read for catalogue
CREATE POLICY "Commodities are visible to all users" ON public.commodities
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Units are visible to all users" ON public.units_of_measure
    FOR SELECT USING (is_active = TRUE);

-- Profile policies
CREATE POLICY "Users can view any profile" ON public.profiles
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Supply listings policies
CREATE POLICY "Active supply listings are visible to all authenticated users" ON public.supply_listings
    FOR SELECT USING (status != 'draft' OR auth.uid() = owner_profile_id);

CREATE POLICY "Users can insert their own supply listings" ON public.supply_listings
    FOR INSERT WITH CHECK (auth.uid() = owner_profile_id);

CREATE POLICY "Owners can update their supply listings" ON public.supply_listings
    FOR UPDATE USING (auth.uid() = owner_profile_id);

-- Procurement requests policies
CREATE POLICY "Open procurement requests are visible to all authenticated users" ON public.procurement_requests
    FOR SELECT USING (status != 'draft' OR auth.uid() = buyer_profile_id);

CREATE POLICY "Users can insert procurement requests" ON public.procurement_requests
    FOR INSERT WITH CHECK (auth.uid() = buyer_profile_id);

CREATE POLICY "Owners can update procurement requests" ON public.procurement_requests
    FOR UPDATE USING (auth.uid() = buyer_profile_id);

-- Inquiries policies
CREATE POLICY "Inquiries are visible only to participants" ON public.inquiries
    FOR SELECT USING (auth.uid() = initiator_profile_id OR auth.uid() = recipient_profile_id);

CREATE POLICY "Participants can send inquiry messages" ON public.inquiry_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.inquiries i
            WHERE i.id = inquiry_id
            AND (i.initiator_profile_id = auth.uid() OR i.recipient_profile_id = auth.uid())
        )
    );
