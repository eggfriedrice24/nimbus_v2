import * as React from "react"

import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/actions"
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form"

import { SidebarTrigger } from "@/components/ui/sidebar"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <h1 className="text-xl font-bold">Welcome back!</h1>
      </div>

      <CreateWorkspaceForm />
    </div>
  )
}
