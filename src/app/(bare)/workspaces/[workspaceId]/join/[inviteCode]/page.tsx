import * as React from "react"

import { redirect } from "next/navigation"

import { getServerSession } from "@/features/auth/lib/queries"
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form"
import { getWorkspaceInfo } from "@/features/workspaces/lib/queries"

export default async function Join({
  params,
}: {
  params: { workspaceId: string }
}) {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  const workspace = await getWorkspaceInfo(params.workspaceId)

  if (!workspace) {
    redirect(`/workspaces/${params.workspaceId}`)
  }

  return (
    <div className="container mx-auto max-w-2xl flex-1">
      <JoinWorkspaceForm initialValues={workspace} />
    </div>
  )
}
