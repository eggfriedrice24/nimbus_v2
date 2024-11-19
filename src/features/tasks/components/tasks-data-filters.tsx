import { ListTodo } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { tasks, type Task } from "@/server/db/schema/tasks"

import { useTaskFilters } from "../hooks/use-task-filters"
import { getStatusIcon } from "../lib/utils"

export function TasksDataFilters() {
  const [
    { projectId, dueDate, assigneeId, label, search, status, priority },
    setFilters,
  ] = useTaskFilters()

  const onStatusChange = (value: string) => {
    void setFilters({ status: value === "all" ? null : value })
  }

  return (
    <div>
      <Select onValueChange={onStatusChange} defaultValue={status ?? undefined}>
        <SelectTrigger className="capitalize">
          <div className="mr-2 flex items-center gap-2">
            <ListTodo className="size-4" />
            <SelectValue placeholder="Select Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {tasks.status.enumValues.map((item) => {
              const Icon = getStatusIcon(item)
              return (
                <SelectItem key={item} value={item} className="capitalize">
                  <div className="flex items-center">
                    <Icon className="mr-2 size-4" />
                    {item}
                  </div>
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
