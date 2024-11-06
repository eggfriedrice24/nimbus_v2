"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { useSession } from "@/features/auth/hooks/use-session"

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useSession()

  React.useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in")
    }
  }, [data, isLoading, router])

  return (
    <div className="flex-1">
      <h1 className="text-xl font-bold">Welcome back!</h1>
    </div>
  )
}
