import * as React from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Members() {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <h1 className="text-xl font-bold">Members</h1>
      </div>
    </div>
  )
}
