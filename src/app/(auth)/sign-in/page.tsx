import * as React from "react"

import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/actions"
import { LoginCard } from "@/features/auth/components/sign-in-card"

export const dynamic = "force-dynamic"

export default async function SignIn() {
  const session = await getServerSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <LoginCard />
    </div>
  )
}
