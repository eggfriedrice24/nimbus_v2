"use client"

import * as React from "react"

import { Calendar, Kanban, Plus, Table } from "lucide-react"
import { useQueryState } from "nuqs"

import { TailSpin } from "@/components/tailspin"
import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { type Task } from "@/server/db/schema/tasks"

import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { useTaskFilters } from "../hooks/use-task-filters"
import { useBatchUpdateTasks } from "../services/use-batch-update-tasks"
import { useGettasks } from "../services/use-get-tasks"
import { CreateTaskModal } from "./create-task-modal"
import TasksKanbanBoard from "./tasks-kanban/data-kanban"
import { DataTableSkeleton } from "../../../components/data-table/data-table-skeleton"
import { TasksTable } from "./tasks-table/tasks-table"
import { TasksDataFilters } from "./tasks-data-filters"

export function TaskViewSwitcher() {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "kanban",
  })
  const { open } = useCreateTaskModal()

  const workspaceId = useWorkspaceId()

  const [{ projectId, dueDate, assigneeId, label, status, priority }] =
    useTaskFilters()

  const { data: tasks, isLoading } = useGettasks({
    filters: {
      workspaceId,
      projectId,
      dueDate,
      assigneeId,
      label,
      status,
      priority,
    },
  })

  const { mutate } = useBatchUpdateTasks()

  const onKanbanChange = React.useCallback(
    (tasks: { id: string; status: Task["status"]; position: number }[]) => {
      mutate({
        json: { updates: tasks },
      })
    },
    [mutate]
  )

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

        <div className="flex w-full flex-1">
          <TabsContent value="kanban" className="h-full flex-1">
            {isLoading && <TailSpin />}
            {!isLoading && tasks?.data && (
              <TasksKanbanBoard
                // @ts-expect-error sad
                tasks={tasks.data}
                onKanbanChange={onKanbanChange}
              />
            )}
          </TabsContent>
          <TabsContent value="table" className="flex-1">
            {isLoading && (
              <DataTableSkeleton
                columnCount={6}
                rowCount={10}
                withPagination={false}
              />
            )}
            {/* @ts-expect-error sad */}
            {!isLoading && tasks?.data && <TasksTable tasks={tasks.data} />}
          </TabsContent>
          <TabsContent value="calendar" className="flex-1">
            {isLoading && <TailSpin />}
            {!isLoading && tasks?.data && JSON.stringify(tasks)}
          </TabsContent>
        </div>
      </Tabs>

      <CreateTaskModal />
    </>
  )
}
