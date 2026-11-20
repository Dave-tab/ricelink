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
      ...props
    },
    ref
  ) => {
    let variantStyles = 'bg-[#15803d] text-white hover:bg-[#166534] shadow-xs focus:ring-2 focus:ring-[#15803d]/30'
    if (variant === 'secondary') {
      variantStyles = 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-xs focus:ring-2 focus:ring-gray-300'
    } else if (variant === 'outline') {
      variantStyles = 'bg-transparent text-[#15803d] border-2 border-[#15803d] hover:bg-[#15803d]/5 focus:ring-2 focus:ring-[#15803d]/30'
    } else if (variant === 'amber') {
      variantStyles = 'bg-[#d97706] text-white hover:bg-[#b45309] shadow-xs focus:ring-2 focus:ring-[#d97706]/30'
    } else if (variant === 'danger') {
      variantStyles = 'bg-rose-700 text-white hover:bg-rose-800 focus:ring-2 focus:ring-rose-600/30'
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
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
