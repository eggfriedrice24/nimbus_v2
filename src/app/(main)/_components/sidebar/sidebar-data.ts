import {
  Bot,
  Home,
  Kanban,
  LifeBuoy,
  Medal,
  Send,
  Settings2,
  UserCog,
  Webhook,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  icon: LucideIcon
  url?: string
  isActive?: boolean
  items?: Array<{
    title: string
    url: string
  }>
}

export interface Project {
  name: string
  url: string
  icon: LucideIcon
}

export interface SearchResult {
  title: string
  teaser: string
  url: string
}

export interface Data {
  navMain: NavItem[]
  navSecondary: NavItem[]
  projects: Project[]
  searchResults: SearchResult[]
}

export const data: Data = {
  navMain: [
    {
      title: "Home",
      url: "",
      icon: Home,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: Kanban,
    },
    {
      title: "Members",
      url: "/members",
      icon: Bot,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
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
      name: "PlayPal",
      url: "#",
      icon: Medal,
    },
    {
      name: "Dealflow",
      url: "#",
      icon: UserCog,
    },
    {
      name: "Hono/Openapi Starter",
      url: "#",
      icon: Webhook,
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
