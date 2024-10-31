import * as React from "react"

import { AuthButton } from "@/features/auth/components/auth-btn"
import { SquareKanban } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-full border bg-primary">
            <SquareKanban className="stroke-black" />
          </div>
          <span className="font-bold">Nimbus</span>
        </div>

        <AuthButton />
      </div>
      {children}
    </div>
  )
}
