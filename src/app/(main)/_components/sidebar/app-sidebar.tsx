"use client"

import { useSession } from "@/features/auth/hooks/use-session"

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

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <WorkspaceSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <DottedSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">Platform</SidebarGroupLabel>
          <SidebarMenu>
            <NavMain items={data.navMain} searchResults={data.searchResults} />
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
