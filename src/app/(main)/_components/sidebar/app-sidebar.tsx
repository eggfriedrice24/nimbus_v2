"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { useSession } from "@/features/auth/services/use-session"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal"

import { NavProjects } from ".//nav-projects"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { data } from "./sidebar-data"
import { WorkspaceSwitcher } from "./workspace-switcher"

export function AppSidebar() {
  const { data: session, isFetched } = useSession()

  const { open } = useCreateWorkspaceModal()
  const { open: openProjectModal } = useCreateProjectModal()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <div className="mb-2 flex items-center justify-between">
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

        <DottedSeparator className="px-3" />

        <SidebarGroup>
          <div className="mb-2 flex items-center justify-between">
            <SidebarGroupLabel className="font-bold">
              Projects
            </SidebarGroupLabel>

            <Button
              type="button"
              className="size-6 bg-sidebar"
              variant="outline"
              onClick={openProjectModal}
            >
              <Plus className="size-4" />
            </Button>
          </div>

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

      <DottedSeparator className="mt-2 px-3" />

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
