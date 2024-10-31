"use client"

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
  SquareKanban,
} from "lucide-react"

import { DottedSeparator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { NavProjects } from ".//nav-projects"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      url: "/settings",
      icon: Settings2,
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
  return (
    <Sidebar className="bg-accent px-1.5 dark:bg-slate-900">
      <SidebarHeader className="flex-row items-center gap-2 py-4">
        <div className="grid size-9 place-items-center rounded-full border bg-primary">
          <SquareKanban className="stroke-black" />
        </div>
        <span className="font-bold">Nimbus</span>
      </SidebarHeader>

      <DottedSeparator />

      <SidebarContent>
        <SidebarMenu>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>

          <TeamSwitcher teams={data.teams} />
        </SidebarMenu>

        <DottedSeparator />

        <SidebarMenu>
          <NavMain items={data.navMain} searchResults={data.searchResults} />
        </SidebarMenu>

        <DottedSeparator />

        <SidebarMenu>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <NavProjects projects={data.projects} />
        </SidebarMenu>

        <SidebarMenu className="mt-auto">
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarMenu>
      </SidebarContent>

      <DottedSeparator className="mt-2" />

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
