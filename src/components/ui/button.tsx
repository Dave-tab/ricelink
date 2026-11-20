import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
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
      ...props
    },
    ref
  ) => {
    let variantStyles = 'bg-[#143d2b] text-white hover:bg-[#002717] focus:ring-2 focus:ring-[#143d2b]'
    if (variant === 'secondary') {
      variantStyles = 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300'
    } else if (variant === 'outline') {
      variantStyles = 'bg-transparent text-[#143d2b] border border-[#143d2b] hover:bg-[#143d2b]/5 focus:ring-2 focus:ring-[#143d2b]'
    } else if (variant === 'danger') {
      variantStyles = 'bg-[#991b1b] text-white hover:bg-[#7f1d1d] focus:ring-2 focus:ring-red-600'
    }

    let sizeStyles = 'min-h-[44px] px-4 py-2 text-sm'
    if (size === 'sm') {
      sizeStyles = 'min-h-[36px] px-3 py-1.5 text-xs'
    } else if (size === 'lg') {
      sizeStyles = 'min-h-[48px] px-6 py-3 text-base'
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
