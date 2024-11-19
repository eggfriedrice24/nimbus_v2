"use client"

import {
  Bot,
  Calendar,
  Folders,
  Kanban,
  ListTodo,
  Plus,
  Table,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { CreateTaskModal } from "./create-task-modal"

export function TaskViewSwitcher() {
  const { open } = useCreateTaskModal()

  return (
    <>
      <Tabs defaultValue="kanban" className="flex flex-1 flex-col items-start">
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

      <CreateTaskModal />
    </>
  )
}
