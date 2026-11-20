import { Sprout } from 'lucide-react'

/**
 * Public footer displayed on landing/public pages.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-semibold text-primary-800">RiceLink</span>
          </div>
          <p className="text-sm text-text-muted">
            Connecting agricultural production to markets, processing and distribution.
          </p>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} RiceLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
