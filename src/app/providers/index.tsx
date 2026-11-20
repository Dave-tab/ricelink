import type { ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { BrowserRouter } from 'react-router-dom'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Wraps the entire application with global providers.
 * Order matters: outermost providers are available to all inner providers.
 *
 * Current providers:
 * - BrowserRouter: client-side routing
 * - QueryProvider: TanStack Query for data fetching
 *
 * Future providers will include:
 * - AuthProvider: Supabase authentication context
 * - NotificationProvider: in-app notification system
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <QueryProvider>
        {children}
      </QueryProvider>
    </BrowserRouter>
  )
}
