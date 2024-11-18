import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"
import { Edit3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getServerSession } from "@/features/auth/lib/queries"
import { getProject } from "@/features/projects/lib/queries"

export default async function Projects({
  params,
}: {
  params: { projectId: string; workspaceId: string }
}) {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  const project = await getProject({
    projectId: params.projectId,
    workspaceId: params.workspaceId,
  })

  if (!project) {
    throw new Error("Project not found.")
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">
          <span className="mr-2 text-2xl">{project.emoji}</span>
          {project.name}
        </h1>

        <Button asChild size="sm">
          <Link
            href={`/workspaces/${params.workspaceId}/projects/${params.projectId}/settings`}
          >
            <Edit3 />
            Edit Project
          </Link>
        </Button>
      </div>
    </div>
  )
}
