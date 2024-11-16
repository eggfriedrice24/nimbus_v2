import * as React from "react"

import { redirect } from "next/navigation"

import { getServerSession } from "@/features/auth/lib/queries"

export default async function Join() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div className="flex-1">
      <h1 className="text-xl font-bold">Join</h1>
    </div>
  )
}
