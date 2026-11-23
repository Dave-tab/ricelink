
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'amber' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    let variantStyles =
      'bg-[#15803d] text-white shadow-sm hover:bg-[#166534] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#15803d]/40'

    if (variant === 'secondary') {
      variantStyles =
        'bg-white text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-gray-300'
    } else if (variant === 'outline') {
      variantStyles =
        'bg-transparent text-[#15803d] border-2 border-[#15803d] hover:bg-[#15803d]/5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#15803d]/30'
    } else if (variant === 'amber') {
      variantStyles =
        'bg-[#d97706] text-white shadow-sm hover:bg-[#b45309] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#d97706]/30'
    } else if (variant === 'danger') {
      variantStyles =
        'bg-rose-700 text-white hover:bg-rose-800 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-600/30'
    }

    let sizeStyles = 'min-h-[44px] px-4 py-2 text-sm'

    if (size === 'sm') {
      sizeStyles = 'min-h-[38px] px-3.5 py-1.5 text-xs'
    } else if (size === 'lg') {
      sizeStyles = 'min-h-[50px] px-6 py-3 text-base font-bold'
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center gap-2 rounded-xl font-bold
          transition-all duration-200 ease-out
          hover:-translate-y-0.5
          active:translate-y-0 active:scale-[0.98]
          focus-visible:outline-none
          disabled:cursor-not-allowed disabled:opacity-50
          disabled:hover:translate-y-0 disabled:hover:shadow-none
          ${sizeStyles}
          ${variantStyles}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
