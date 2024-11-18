import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"

import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getServerSession } from "@/features/auth/lib/queries"
import { getProject } from "@/features/projects/lib/queries"

export default async function GeneralSettings({
  params,
}: {
  params: { workspaceId: string; projectId: string }
}) {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  const project = await getProject({
    projectId: params.projectId,
    workspaceId: params.workspaceId,
  })

  return (
    <div className="container mx-auto flex max-w-2xl flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="secondary">
          <Link
            href={`/workspaces/${params.workspaceId}/projects/${params.projectId}`}
          >
            <ChevronLeft className="mr-2 size-4" />
            Back to {project?.name} {project?.emoji}
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Project Settings</h1>
      </div>

      <div className="flex flex-1 flex-col gap-4"></div>
    </div>
  )
}
