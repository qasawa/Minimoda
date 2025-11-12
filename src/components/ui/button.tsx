import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-lg hover:shadow-xl hover:from-coral-600 hover:to-coral-700 hover:scale-105 transition-all duration-300',
        secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300',
        outline: 'border-2 border-gradient-to-r from-coral-500 to-pink-500 bg-transparent text-coral-500 hover:bg-gradient-to-r hover:from-coral-50 hover:to-pink-50 hover:scale-105 transition-all duration-300',
        ghost: 'hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 hover:scale-105 transition-all duration-300',
        link: 'text-coral-500 underline-offset-4 hover:underline hover:text-coral-600 transition-colors duration-200',
        web3: 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 px-4',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Web3 Shimmer Effect */}
        {(variant === 'web3' || variant === 'default' || variant === 'secondary') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        )}
        
        {/* Button Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* Web3 Glow Effect */}
        {variant === 'web3' && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
