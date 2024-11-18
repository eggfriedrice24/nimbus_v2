import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"

import {
  Bot,
  Calendar,
  Edit3,
  Folders,
  Kanban,
  ListTodo,
  Plus,
  Table,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
        <Tabs
          defaultValue="kanban"
          className="flex flex-1 flex-col items-start"
        >
          <div className="flex w-full items-center justify-between">
            <TabsList>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <Kanban className="size-3.5" /> Kanban
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="size-3.5" />
                Table
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                Calendar
              </TabsTrigger>
            </TabsList>

            <Button size="xs">
              <Plus /> New
            </Button>
          </div>

          <DottedSeparator className="my-4" />

          <div className="flex items-center gap-4" role="toolbar">
            <Button size="sm" variant="outline">
              <ListTodo />
            </Button>

            <Button size="sm" variant="outline">
              <Bot />
            </Button>

            <Button size="sm" variant="outline">
              <Folders />
            </Button>
          </div>

          <DottedSeparator className="my-4" />

          <div className="flex w-full flex-1 items-center justify-center">
            <TabsContent value="kanban">Kanban Board</TabsContent>
            <TabsContent value="table">Table View</TabsContent>
            <TabsContent value="calendar">Calendar View</TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  )
}
