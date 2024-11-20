import { Badge } from "@/components/ui/badge"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type Task } from "@/server/db/schema/tasks"

import { getStatusIcon } from "../../lib/utils"

export function KanbanColumnHeader({
  column,
  count,
}: {
  column: Task["status"]
  count: number
}) {
  const { icon: ColHeaderIcon, color } = getStatusIcon(column)

  return (
    <CardHeader className="rounded-t-xl">
      <CardTitle className="flex items-center text-xl font-semibold">
        <ColHeaderIcon className={cn("mr-2 size-5", color)} />
        <span className="ml-2 capitalize">{column}</span>
        <Badge className="ml-auto rounded-full" variant="secondary">
          {count}
        </Badge>
      </CardTitle>
    </CardHeader>
  )
}
