import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/lib/queries"
import { DeleteWorkspaceAlert } from "@/features/workspaces/components/delete-workspace-alert"
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form"
import { getWorkspace } from "@/features/workspaces/lib/queries"
import { BriefcaseBusiness, ChevronLeft } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DottedSeparator } from "@/components/ui/separator"

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
    <div className="container mx-auto max-w-2xl py-8">
      <Link
        href={`/workspaces/${params.workspaceId}`}
        className="mb-4 flex items-center text-primary"
      >
        <ChevronLeft className="mr-2 size-4" />
        Back to Workspace
      </Link>
      <h1 className="mb-8 text-3xl font-bold">Workspace Settings</h1>
      <div className="space-y-8">
        <Card className="border border-border bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Update Workspace</CardTitle>
                <CardDescription>
                  Modify your workspace details below.
                </CardDescription>
              </div>
              <BriefcaseBusiness className="size-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <UpdateWorkspaceForm initialValues={{ ...workspace }} />
          </CardContent>
        </Card>

        <DottedSeparator />

        <DeleteWorkspaceAlert />
      </div>
    </div>
  )
}
