"use client"

import * as React from "react"

import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-12 w-full rounded-md bg-accent/70 ring-ring hover:bg-accent/70 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
          <div className="flex size-5 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <activeTeam.logo className="size-8 shrink-0" />
          </div>
          <div className="line-clamp-1 flex-1 pr-2 font-medium">
            {activeTeam?.name}
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="start"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Teams
        </DropdownMenuLabel>
        {teams.map((team, index) => (
          <DropdownMenuItem
            key={team.name}
            onClick={() => setActiveTeam(team)}
            className="items-start gap-2 px-1.5"
          >
            <div className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <team.logo className="size-5 shrink-0" />
            </div>
            <div className="grid flex-1 leading-tight">
              <div className="line-clamp-1 font-medium">{team.name}</div>
              <div className="overflow-hidden text-xs text-muted-foreground">
                <div className="line-clamp-1">{team.plan}</div>
              </div>
            </div>
            <DropdownMenuShortcut className="self-center">
              ⌘{index + 1}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 px-1.5">
          <div className="flex size-8 items-center justify-center rounded-md border bg-background">
            <Plus className="size-5" />
          </div>
          <div className="font-medium text-muted-foreground">Add workspace</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
