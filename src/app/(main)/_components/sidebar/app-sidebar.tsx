"use client"

import { useSession } from "@/features/auth/hooks/use-session"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal"
import { Plus, SquareKanban } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"

import { NavProjects } from ".//nav-projects"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { data } from "./sidebar-data"
import { WorkspaceSwitcher } from "./workspace-switcher"

export function AppSidebar() {
  const { data: session, isFetched } = useSession()

  const { open } = useCreateWorkspaceModal()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-full border bg-primary">
            <SquareKanban className="stroke-black" />
          </div>

          <div className="flex flex-col gap-0">
            <h1 className="font-bold">Nimbus</h1>

            <span className="text-[10px] text-muted-foreground">
              Staying above the clouds of productivity.
            </span>
          </div>
        </div>
      </SidebarHeader>

      <DottedSeparator className="my-3" />

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="font-bold">
              Workspaces
            </SidebarGroupLabel>

            <Button
              type="button"
              className="size-6 bg-sidebar"
              variant="outline"
              onClick={open}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <WorkspaceSwitcher />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">Platform</SidebarGroupLabel>
          <SidebarMenu>
            <NavMain items={data.navMain} />
          </SidebarMenu>
        </SidebarGroup>

        <DottedSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">Projects</SidebarGroupLabel>
          <SidebarMenu>
            <NavProjects projects={data.projects} />
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title} className="min-h-max">
                  <SidebarMenuButton size="sm" disabled>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <DottedSeparator className="mt-2" />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isFetched ? (
              <NavUser
                user={{
                  name: session?.session.name ?? "",
                  email: session?.session.email ?? "",
                  avatar: "/avatars/shadcn.jpg",
                }}
              />
            ) : (
              <SidebarMenuSkeleton showIcon className="h-10" />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
