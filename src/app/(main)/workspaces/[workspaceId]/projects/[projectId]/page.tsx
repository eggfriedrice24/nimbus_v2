import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"

import { Edit3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getServerSession } from "@/features/auth/lib/queries"
import { getProject } from "@/features/projects/lib/queries"
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher"

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
    <div className="flex flex-1 flex-col gap-14">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">
            <span className="mr-2 text-2xl">{project.emoji}</span>
            {project.name}
          </h1>

          <p className="text-sm text-muted-foreground">
            Monitor all tasks related to this project here
          </p>
        </div>

        <Button asChild size="sm">
          <Link
            href={`/workspaces/${params.workspaceId}/projects/${params.projectId}/settings`}
          >
            <Edit3 />
            Edit Project
          </Link>
        </Button>
      </div>

      <section className="flex flex-1 rounded-lg border p-2">
        <TaskViewSwitcher />
      </section>
    </div>
  )
}
