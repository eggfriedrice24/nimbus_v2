import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getServerSession } from "@/features/auth/lib/queries"
import { DeleteWorkspaceAlert } from "@/features/workspaces/components/delete-workspace-alert"
import ResetInviteCard from "@/features/workspaces/components/reset-invite-code-card"
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form"
import { getWorkspace } from "@/features/workspaces/lib/queries"

export default async function GeneralSettings({
  params,
}: {
  params: { workspaceId: string }
}) {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  const workspace = await getWorkspace(params.workspaceId)

  if (!workspace) {
    redirect(`/workspaces/${params.workspaceId}`)
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="secondary">
          <Link href={`/workspaces/${params.workspaceId}`}>
            <ChevronLeft className="mr-2 size-4" />
            Back to Workspace
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Workspace Settings</h1>
      </div>
      <div className="space-y-4">
        <UpdateWorkspaceForm initialValues={{ ...workspace }} />

        <ResetInviteCard initialValues={{ inviteCode: workspace.inviteCode }} />

        <DeleteWorkspaceAlert />
      </div>
    </div>
  )
}
