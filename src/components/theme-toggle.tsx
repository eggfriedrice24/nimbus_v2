"use client"

import * as React from "react"

import * as SwitchPrimitives from "@radix-ui/react-switch"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-7 w-[3.9rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary"
      )}
      checked={isDarkMode}
      onCheckedChange={toggleTheme}
      aria-label="Toggle theme"
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "relative block size-6 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[35px] data-[state=unchecked]:translate-x-0"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-between px-1" />
      </SwitchPrimitives.Thumb>

      <div className="absolute flex w-14 justify-between px-0.5">
        <SunIcon className="ml-0.5 size-3.5 stroke-black" />
        <MoonIcon className="size-3.5 stroke-white data-[state=unchecked]:stroke-black" />
      </div>
    </SwitchPrimitives.Root>
  )
}
