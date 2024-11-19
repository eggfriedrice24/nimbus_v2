"use client"

import * as React from "react"

import { NotebookPen } from "lucide-react"

import { ResponsiveModal } from "@/components/responsive-modal"

import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { CreateTaskForm } from "./create-task-form"

export function CreateTaskModal() {
  const { isOpen, setIsOpen } = useCreateTaskModal()

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Task"
      description="Fill in the form below to create a task."
      icon={<NotebookPen className="size-8 text-white" />}
      className="flex flex-col gap-7"
    >
      <CreateTaskForm />
    </ResponsiveModal>
  )
}
