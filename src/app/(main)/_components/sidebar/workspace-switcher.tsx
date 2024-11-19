"use client"

import * as React from "react"

import { useRouter } from "next/navigation"

import { BriefcaseBusiness, ChevronsUpDown, CircuitBoard } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { CreateProjectModal } from "@/features/projects/components/create-project-modal"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { type User } from "@/server/db/schema/user"
import { type Workspace } from "@/server/db/schema/workspaces"

export function WorkspaceSwitcher({
  workspaces,
}: {
  workspaces: (Workspace & { user: User })[]
}) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const activeWorkspace =
    workspaces?.find((ws) => ws.id === workspaceId) ?? workspaces?.[0]

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`)
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="group border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary-foreground group-hover:bg-sidebar">
              <BriefcaseBusiness className="size-4 stroke-primary" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {activeWorkspace?.name}
              </span>
              <span className="truncate text-xs">
                {activeWorkspace?.user.name}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            workspaces
          </DropdownMenuLabel>
          {workspaces?.map((workspace, index) => (
            <DropdownMenuItem
              key={workspace.name}
              onClick={() => {
                onSelect(workspace.id)
              }}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <CircuitBoard className="size-4 shrink-0" />
              </div>
              {workspace.name}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceModal />
      <CreateProjectModal />
    </SidebarMenuItem>
  )
}
