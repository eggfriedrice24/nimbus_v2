"use client"

import * as React from "react"

import { useSession } from "@/features/auth/services/use-session"
import { SquareKanban } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { data: session, isFetched } = useSession()

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-full border bg-primary">
            <SquareKanban className="stroke-black" />
          </div>
          <span className="font-bold">Nimbus</span>
        </div>

        {isFetched ? (
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            {session?.session.name?.charAt(0)}
          </div>
        ) : (
          <Skeleton className="h-10 w-32 rounded" />
        )}
      </div>
      {children}
    </div>
  )
}
