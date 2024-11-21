"use client"

import * as React from "react"

import { NotebookPen } from "lucide-react"

import { ResponsiveModal } from "@/components/responsive-modal"
import { type Task } from "@/server/db/schema/tasks"

import { UpdateTaskForm } from "./update-task-form"

export function UpdateTaskModal({
  initialValues,
  updateDialogOpen,
  setUpdateDialogOpen,
}: {
  initialValues: Task
  updateDialogOpen: boolean
  setUpdateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <ResponsiveModal
      open={updateDialogOpen}
      onOpenChange={setUpdateDialogOpen}
      title="Update Task"
      description="Fill in the form below to update a task."
      icon={<NotebookPen className="size-8 text-white" />}
      className="flex flex-col gap-7"
    >
      <UpdateTaskForm
        initialValues={initialValues}
        setUpdateDialogOpen={setUpdateDialogOpen}
      />
    </ResponsiveModal>
  )
}
