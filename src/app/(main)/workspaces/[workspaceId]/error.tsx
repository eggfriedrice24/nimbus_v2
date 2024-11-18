"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <span className="text-center">Oops! Something went wrong 😕</span>
      <Button onClick={reset} size="xs">
        Try again
      </Button>
    </div>
  )
}
