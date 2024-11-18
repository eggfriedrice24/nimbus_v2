import Link from "next/link"
import { usePathname } from "next/navigation"

import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { type Project } from "@/server/db/schema/projects"

export function NavProjects({
  projects,
}: {
  projects: Project[]
} & React.ComponentProps<"ul">) {
  const workspaceId = useWorkspaceId()

  const pathname = usePathname()

  return (
    <>
      {projects.map((item) => (
        <SidebarMenuItem key={item.name} className="min-h-8">
          <SidebarMenuButton
            asChild
            className="h-8"
            isActive={
              pathname === `/workspaces/${workspaceId}/projects/${item.id}`
            }
          >
            <Link href={`/workspaces/${workspaceId}/projects/${item.id}`}>
              <span>{item.emoji}</span>
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 rounded-lg"
              side="bottom"
              align="end"
            >
              <DropdownMenuItem>
                <Folder className="text-muted-foreground" />
                <span>View Project</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Forward className="text-muted-foreground" />
                <span>Share Project</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash2 className="text-muted-foreground" />
                <span>Delete Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton className="text-sidebar-foreground/70">
          <MoreHorizontal className="text-sidebar-foreground/70" />
          <span>More</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  )
}
