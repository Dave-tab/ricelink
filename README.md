# RiceLink

**RiceLink** is a multi-crop agricultural supply-chain coordination platform designed to connect agricultural producers, aggregators, processors, storage providers, logistics operators, and institutional buyers.

## Key Principles

- **Multi-Crop by Design**: One shared agricultural commodity catalogue (Rice, Maize, Sorghum, Millet, Cassava, Yam, Soybean, Cowpea, Groundnut, Tomatoes, Pepper, Onion, Cocoa, Cashew, Sesame, etc.).
- **Participant & Organisation Separation**: Independent users, multiple organisations, role-based access.
- **Independent Supply & Demand**: Separate records, validation workflows, and deterministic matching engine.
- **Explicit Measurement**: Mandatory units of measurement with strictly controlled conversion rules.
- **Deterministic Rule-Based Matching**: Suggests potential opportunities without committing participants to transactions.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data Fetching**: TanStack Query v5
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Edge Functions, Storage)
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## Project Structure

```
ricelink/
├── docs/                     # Specifications: architecture, product, requirements, srs
├── public/
├── src/
│   ├── app/                  # Router and Providers
│   ├── components/           # UI and Layout components
│   ├── features/             # Domain modules (auth, supply, demand, matching, etc.)
│   ├── lib/                  # External services (Supabase client)
│   ├── hooks/                # Shared custom hooks
│   ├── types/                # TypeScript definitions
│   └── utils/                # Helper utilities
├── supabase/
│   ├── migrations/           # Version-controlled SQL migrations
│   └── functions/            # Supabase edge functions
├── .env.example
├── package.json
└── vite.config.ts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase project URL and anon public key.

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
