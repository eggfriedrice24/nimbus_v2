import * as React from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./_components/sidebar/app-sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const { cookies } = await import("next/headers")

  return (
    <SidebarProvider
      defaultOpen={
        cookies().get("sidebar:state")?.value === "true" ||
        !cookies().get("sidebar:state")
      }
    >
      <AppSidebar />

      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
