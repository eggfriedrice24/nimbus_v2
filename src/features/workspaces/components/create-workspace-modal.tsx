"use client"

import * as React from "react"

import { BriefcaseBusiness } from "lucide-react"

import { ResponsiveModal } from "@/components/responsive-modal"

import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal"
import { CreateWorkspaceForm } from "./create-workspace-form"

export function CreateWorkspaceModal() {
  const { isOpen, setIsOpen } = useCreateWorkspaceModal()

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Workspace"
      description="Enter a name for your new workspace and start collaborating!"
      icon={<BriefcaseBusiness className="size-14 text-white" />}
      className="flex flex-col gap-7"
    >
      <CreateWorkspaceForm />
    </ResponsiveModal>
  )
}
