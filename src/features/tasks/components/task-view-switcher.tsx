"use client"

import * as React from "react"

import {
  Bot,
  Calendar,
  Folders,
  Kanban,
  ListTodo,
  Plus,
  Table,
} from "lucide-react"
import { useQueryState } from "nuqs"

import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { type getTasks } from "../lib/queries"
import { CreateTaskModal } from "./create-task-modal"
import { TasksDataFilters } from "./tasks-data-filters"

export function TaskViewSwitcher({
  tasksPromise,
}: {
  tasksPromise: ReturnType<typeof getTasks>
}) {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "kanban",
  })
  const { open } = useCreateTaskModal()

  const tasks = React.use(tasksPromise)

  return (
    <>
      <Tabs
        defaultValue={view}
        onValueChange={setView}
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

          <Button size="xs" onClick={open}>
            <Plus /> New
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex items-center gap-4" role="toolbar">
          <TasksDataFilters />
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex w-full flex-1 items-center justify-center">
          <TabsContent value="kanban">{JSON.stringify(tasks)}</TabsContent>
          <TabsContent value="table">Table View</TabsContent>
          <TabsContent value="calendar">Calendar View</TabsContent>
        </div>
      </Tabs>

      <CreateTaskModal />
    </>
  )
}
