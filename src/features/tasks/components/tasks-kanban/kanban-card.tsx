import { formatDistance, isPast } from "date-fns"
import { Calendar } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type Task } from "@/server/db/schema/tasks"

import { getLabelBadgeVariantAndIcon, getPriorityIcon } from "../../lib/utils"
import { TaskActionsDropdown } from "../task-actions-dropdown"

export function KanbanCard({ task }: { task: Task }) {
  const { icon: LabelIcon, variant } = getLabelBadgeVariantAndIcon(task.label)
  const { icon: PriorityIcon, color } = getPriorityIcon(task.priority)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">{task.title}</h3>
        <TaskActionsDropdown task={task} view="kanban" />
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={variant} className="capitalize">
          {<LabelIcon className={cn("mr-1 size-4")} />}
          {task.label}
        </Badge>
        <Badge className="capitalize" variant="outline">
          <PriorityIcon className={cn("mr-2 size-4", color)} />
          {task.priority}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src="#" />
            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500">{task.assignee.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar
            className={cn(
              "size-3.5",
              isPast(task.dueDate) ? "text-destructive" : undefined
            )}
          />
          <span
            className={cn(
              "text-xs",
              isPast(task.dueDate) ? "text-destructive" : undefined
            )}
          >
            {formatDistance(new Date(), task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  )
}
