import * as React from "react"

import { toast } from "sonner"

export const useCopy = () => {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      toast.success("Invite code copied!")
    } catch {
      setIsCopied(false)
      toast.error("Failed to copy")
    } finally {
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return { isCopied, copyToClipboard }
}
