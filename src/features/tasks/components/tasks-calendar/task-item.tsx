import { MoreVertical } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { type Task } from "@/server/db/schema/tasks"

import { getLabelBadgeVariantAndIcon } from "../../lib/utils"

export function TaskItem({ task }: { task: Task }) {
  const { icon: Icon } = getLabelBadgeVariantAndIcon(task.label)

  return (
    <div className="rounded p-1 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Icon className={cn("mr-2 size-4")} />
          <span className="truncate">{task.title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-6">
              <MoreVertical className="size-3" />
              <span className="sr-only">Task options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <Badge variant="outline" className="text-[10px]">
          {task.status}
        </Badge>
        <Badge>{task.priority}</Badge>
      </div>
    </div>
  )
}
