import * as React from "react"

import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/queries"

export default async function GeneralSettings() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div className="flex-1">
      <h1 className="text-xl font-bold">General Settings</h1>
    </div>
  )
}
