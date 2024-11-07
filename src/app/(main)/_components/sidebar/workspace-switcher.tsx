"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form"
import { useGetWorkspaces } from "@/features/workspaces/hooks/use-get-workspaces"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/useCreateWorkspaceModal"
import { BriefcaseBusiness, ChevronsUpDown, CircuitBoard } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function WorkspaceSwitcher() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { isOpen: open, setIsOpen: setOpen } = useCreateWorkspaceModal()

  const { data: workspaces, isLoading } = useGetWorkspaces()

  const activeWorkspace =
    workspaces?.find((ws) => ws.id === workspaceId) ?? workspaces?.[0]

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded" />
            ) : (
              <>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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
              </>
            )}
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

      <CreateWorkspaceForm open={open} onOpenChange={setOpen} />
    </>
  )
}
