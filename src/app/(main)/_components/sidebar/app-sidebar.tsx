"use client"

import { useSession } from "@/features/auth/hooks/use-session"
import {
  Atom,
  Bot,
  Eclipse,
  Frame,
  Home,
  Kanban,
  LifeBuoy,
  Map,
  PieChart,
  Rabbit,
  Send,
  Settings2,
} from "lucide-react"

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
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavProjects } from ".//nav-projects"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Atom,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: Eclipse,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Rabbit,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: Kanban,
    },

    {
      title: "Settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
      ],
    },
    {
      title: "Members",
      url: "/members",
      icon: Bot,
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],

  searchResults: [
    {
      title: "Routing Fundamentals",
      teaser:
        "The skeleton of every application is routing. This page will introduce you to the fundamental concepts of routing for the web and how to handle routing in Next.js.",
      url: "#",
    },
    {
      title: "Layouts and Templates",
      teaser:
        "The special files layout.js and template.js allow you to create UI that is shared between routes. This page will guide you through how and when to use these special files.",
      url: "#",
    },
    {
      title: "Data Fetching, Caching, and Revalidating",
      teaser:
        "Data fetching is a core part of any application. This page goes through how you can fetch, cache, and revalidate data in React and Next.js.",
      url: "#",
    },
    {
      title: "Server and Client Composition Patterns",
      teaser:
        "When building React applications, you will need to consider what parts of your application should be rendered on the server or the client. ",
      url: "#",
    },
    {
      title: "Server Actions and Mutations",
      teaser:
        "Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.",
      url: "#",
    },
  ],
}

export function AppSidebar() {
  const { data: session, isFetched } = useSession()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <TeamSwitcher teams={data.teams} />
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

      <SidebarRail />
    </Sidebar>
  )
}
