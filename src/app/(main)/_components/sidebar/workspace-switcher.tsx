"use client"

import * as React from "react"

import { useGetWorkspaces } from "@/features/workspaces/hooks/use-get-workspaces"
import { type User } from "@/server/db/schema/user"
import { type Workspace } from "@/server/db/schema/workspaces"
import {
  BriefcaseBusiness,
  ChevronsUpDown,
  CircuitBoard,
  Plus,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function WorkspaceSwitcher() {
  const { data: workspaces, isLoading } = useGetWorkspaces()

  const [activeWorkspace, setActiveWorkspace] = React.useState<
    (Workspace & { user: User }) | null
  >()

  React.useEffect(() => {
    if (workspaces && workspaces.length > 0 && !activeWorkspace) {
      // @ts-expect-error string -> date
      setActiveWorkspace(workspaces[0])
    }
  }, [workspaces, activeWorkspace])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoading ? (
          <Skeleton className="h-10 w-full rounded" />
        ) : (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
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
          </SidebarMenuButton>
        )}
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
            // @ts-expect-error string -> date
            onClick={() => setActiveWorkspace(workspace)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <CircuitBoard className="size-4 shrink-0" />
            </div>
            {workspace.name}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Add workspace</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
