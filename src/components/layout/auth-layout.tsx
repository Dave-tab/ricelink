import { Outlet } from 'react-router-dom'
import { Sprout } from 'lucide-react'

/**
 * Layout for authentication pages (login, register, password recovery).
 * Minimal chrome — centered card with branding.
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-secondary p-4">
      <div className="mb-8 flex items-center gap-2">
        <Sprout className="h-8 w-8 text-primary-600" />
        <span className="text-2xl font-bold text-primary-800">RiceLink</span>
      </div>
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
        <Outlet />
      </div>
      <p className="mt-6 text-sm text-text-muted">
        Connecting agricultural production to markets
      </p>
    </div>
  )
}
