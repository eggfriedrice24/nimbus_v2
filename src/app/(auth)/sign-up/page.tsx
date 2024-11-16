import * as React from "react"

import { redirect } from "next/navigation"

import { SignUpForm } from "@/features/auth/components/sign-up-card"
import { getServerSession } from "@/features/auth/lib/queries"

export const dynamic = "force-dynamic"

export default async function SignUp() {
  const session = await getServerSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <SignUpForm />
    </div>
  )
}
