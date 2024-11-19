"use client"

import * as React from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background text-accent-foreground shadow-sm hover:bg-accent hover:text-accent-foreground/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        tertiary:
          "bg-tertiary text-tertiary-foreground shadow hover:bg-tertiary/80",
        ghost:
          "text-accent-foreground hover:bg-accent hover:text-accent-foreground/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3",
        md: "h-9 rounded-md px-3",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  animated?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      onClick,
      asChild = false,
      animated = true,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const [effect, setEffect] = React.useState(false)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (animated) {
        setEffect(true)
      }

      if (onClick) {
        onClick(event)
      }
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          effect && "animate-click"
        )}
        onClick={handleClick}
        onAnimationEnd={() => setEffect(false)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
