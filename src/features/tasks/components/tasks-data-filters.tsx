import { format } from "date-fns"
import { CalendarIcon, ListTodo, UserRoundSearch } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetMembers } from "@/features/members/services/use-get-members"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { cn } from "@/lib/utils"
import { tasks } from "@/server/db/schema/tasks"

import {
  useTaskFilters,
  type LabelEnum,
  type PriorityEnum,
  type StatusEnum,
} from "../hooks/use-task-filters"
import {
  getLabelBadgeVariant,
  getPriorityIcon,
  getStatusIcon,
} from "../lib/utils"

export function TasksDataFilters() {
  const workspaceId = useWorkspaceId()

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  })

  const [{ dueDate, assigneeId, label, status, priority }, setFilters] =
    useTaskFilters()

  const onStatusChange = (value: string) => {
    void setFilters({
      status: value === "all" ? null : (value as StatusEnum),
    })
  }

  const onAssigneeChange = (value: string) => {
    void setFilters({
      assigneeId: value === "all" ? null : value,
    })
  }

  const onPriorityChange = (value: string) => {
    void setFilters({
      priority: value === "all" ? null : (value as PriorityEnum),
    })
  }

  const onLabelChange = (value: string) => {
    void setFilters({
      label: value === "all" ? null : (value as LabelEnum),
    })
  }

  const onDueDateChange = (value: Date) => {
    void setFilters({
      dueDate: value,
    })
  }

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Select onValueChange={onStatusChange} defaultValue={status ?? undefined}>
        <SelectTrigger className="capitalize">
          <div className="mr-2 flex items-center gap-2">
            <ListTodo className="size-4" />
            <SelectValue placeholder="Select Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
          </SelectGroup>

          <SelectGroup>
            {tasks.status.enumValues.map((item) => {
              const { icon: Icon, color } = getStatusIcon(item)
              return (
                <SelectItem key={item} value={item} className="capitalize">
                  <div className="flex items-center">
                    <Icon className={cn("mr-2 size-4", color)} />
                    {item}
                  </div>
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        onValueChange={onPriorityChange}
        defaultValue={priority ?? undefined}
      >
        <SelectTrigger className="capitalize">
          <div className="mr-2 flex items-center gap-2">
            <ListTodo className="size-4" />
            <SelectValue placeholder="Select Priority" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
          </SelectGroup>
          <SelectGroup>
            {tasks.priority.enumValues.map((item) => {
              const { icon: Icon, color } = getPriorityIcon(item)

              return (
                <SelectItem key={item} value={item} className="capitalize">
                  <div className="flex items-center">
                    <Icon className={cn("mr-2 size-4", color)} />
                    {item}
                  </div>
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Label Filter */}
      <Select onValueChange={onLabelChange} defaultValue={label ?? undefined}>
        <SelectTrigger className="capitalize">
          <div className="mr-2 flex items-center gap-2">
            <ListTodo className="size-4" />
            <SelectValue placeholder="Select Label" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
          </SelectGroup>
          <SelectGroup>
            {tasks.label.enumValues.map((item) => (
              <SelectItem key={item} value={item} className="capitalize">
                <Badge variant={getLabelBadgeVariant(item)}>{item}</Badge>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Assignee Filter */}
      <Select
        onValueChange={onAssigneeChange}
        defaultValue={assigneeId ?? undefined}
      >
        <SelectTrigger className="capitalize">
          <div className="mr-2 flex items-center gap-2">
            <UserRoundSearch className="size-4" />
            <SelectValue placeholder="Filter by Assignee" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
          </SelectGroup>
          <SelectGroup>
            {!membersLoading &&
              members?.data?.map((m) => (
                <SelectItem key={m.id} value={m.user.id} className="capitalize">
                  {m.user.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Due Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "h-9 w-full pl-3 text-left font-normal",
              !dueDate && "text-muted-foreground"
            )}
          >
            {dueDate ? (
              format(new Date(dueDate), "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate ? dueDate : undefined}
            // @ts-expect-error sada
            onSelect={onDueDateChange}
            disabled={(date) =>
              date < new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
