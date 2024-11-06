import * as React from "react"

import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/actions"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div className="flex-1">
      <h1 className="text-xl font-bold">Welcome back!</h1>
    </div>
  )
}
