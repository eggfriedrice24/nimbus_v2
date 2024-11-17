"use client"

import * as React from "react"

import { BriefcaseBusiness } from "lucide-react"

import { ResponsiveModal } from "@/components/responsive-modal"

import { useCreateProjectModal } from "../hooks/use-create-project-modal"
import { CreateProjectForm } from "./create-project-form"

export function CreateProjectModal() {
  const { isOpen, setIsOpen } = useCreateProjectModal()

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Project"
      description="Enter a name for your new project and start collaborating!"
      icon={<BriefcaseBusiness className="size-14 text-white" />}
      className="flex flex-col gap-7"
    >
      <CreateProjectForm />
    </ResponsiveModal>
  )
}
