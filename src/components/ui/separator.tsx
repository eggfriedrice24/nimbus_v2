"use client"

import * as React from "react"

import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

const DottedSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    color?: boolean
    height?: string
    dotSize?: string
    gapSize?: string
    orientation?: "vertical" | "horizontal"
  }
>(
  (
    {
      className,
      orientation = "horizontal",
      color = "#4b5563",
      height = "2px",
      dotSize = "2px",
      gapSize = "6px",
      children,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal"

    return (
      <div
        ref={ref}
        className={cn(
          isHorizontal
            ? "flex w-full items-center"
            : "flex h-full flex-col items-center",
          className
        )}
        {...props}
      >
        <div
          className={isHorizontal ? "grow" : "grow-0"}
          style={{
            width: isHorizontal ? "100%" : height,
            height: isHorizontal ? height : "100%",
            backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
            backgroundSize:
              dotSize &&
              gapSize &&
              (isHorizontal
                ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
                : `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`),
            backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
            backgroundPosition: "center",
          }}
        />
        {children}
      </div>
    )
  }
)
DottedSeparator.displayName = SeparatorPrimitive.Root.displayName

export { Separator, DottedSeparator }
