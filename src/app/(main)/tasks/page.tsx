import * as React from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Tasks() {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <h1 className="text-xl font-bold">Tasks</h1>
      </div>
    </div>
  )
}
