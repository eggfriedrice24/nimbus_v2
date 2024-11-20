"use client"

import * as React from "react"

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd"
import { formatDistance, isPast } from "date-fns"
import { Calendar, MoreVertical } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { type Task } from "@/server/db/schema/tasks"

import {
  getLabelBadgeVariantAndIcon,
  getPriorityIcon,
  getStatusIcon,
} from "../../lib/utils"

const statusColumns: Task["status"][] = [
  "backlog",
  "todo",
  "in-progress",
  "in-review",
  "done",
  "canceled",
]

type TasksState = Record<Task["status"], Task[]>

export default function TasksKanbanBoard({
  tasks,
  onKanbanChange,
}: {
  tasks: Task[]
  onKanbanChange: (
    tasks: { id: string; status: Task["status"]; position: number }[]
  ) => void
}) {
  const [tasksState, setTasksState] = React.useState<TasksState>(() => {
    const initialTasks: TasksState = {
      backlog: [],
      todo: [],
      "in-progress": [],
      "in-review": [],
      done: [],
      canceled: [],
    }

    tasks.forEach((t) => initialTasks[t.status].push(t))

    Object.keys(initialTasks).forEach((s) =>
      initialTasks[s as Task["status"]].sort((a, b) => a.position - b.position)
    )

    return initialTasks
  })

  React.useEffect(() => {
    const newTasks: TasksState = {
      backlog: [],
      todo: [],
      "in-progress": [],
      "in-review": [],
      done: [],
      canceled: [],
    }

    tasks.forEach((t) => newTasks[t.status].push(t))

    Object.keys(newTasks).forEach((s) =>
      newTasks[s as Task["status"]].sort((a, b) => a.position - b.position)
    )

    setTasksState(newTasks)
  }, [tasks])

  const onDragEnd = React.useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const { source, destination } = result

      const sourceStatus = source.droppableId as Task["status"]

      const destStatus = destination.droppableId as Task["status"]

      const updatesPayload: {
        id: string
        status: Task["status"]
        position: number
      }[] = []

      setTasksState((prev) => {
        const newTasks = { ...prev }

        const sourceCol = [...newTasks[sourceStatus]]

        const [movedTask] = sourceCol.splice(source.index, 1)

        if (!movedTask) {
          console.error("No task found at source index.")
          return prev
        }

        const updatedTask =
          sourceStatus !== destStatus
            ? { ...movedTask, status: destStatus }
            : movedTask

        newTasks[sourceStatus] = sourceCol

        const destCol = [...newTasks[destStatus]]

        destCol.splice(destination.index, 0, updatedTask)

        newTasks[destStatus] = destCol

        updatesPayload.push({
          id: updatedTask.id,
          status: destStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        })

        newTasks[destStatus].forEach((t, i) => {
          if (t && t.id !== updatedTask.id) {
            const newPosition = Math.min((i + 1) * 1000, 1_000_000)

            if (t.position !== newPosition) {
              updatesPayload.push({
                id: t.id,
                status: destStatus,
                position: newPosition,
              })
            }
          }
        })

        if (sourceStatus !== destStatus) {
          newTasks[destStatus].forEach((t, i) => {
            if (t) {
              const newPosition = Math.min((i + 1) * 1000, 1_000_000)

              if (t.position !== newPosition) {
                updatesPayload.push({
                  id: t.id,
                  status: destStatus,
                  position: newPosition,
                })
              }
            }
          })

          return newTasks
        }
      })

      onKanbanChange(updatesPayload)
    },
    [onKanbanChange]
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScrollArea className="max-w-[calc(100vw-22rem)]">
        <div className="flex w-max space-x-4 p-4">
          {statusColumns.map((column) => {
            const { icon: ColHeaderIcon, color } = getStatusIcon(column)
            return (
              <div key={column} className="w-80 shrink-0">
                <Card className="rounded-xl">
                  <CardHeader className="rounded-t-xl">
                    <CardTitle className="flex items-center text-xl font-semibold">
                      <ColHeaderIcon className={cn("mr-2 size-5", color)} />
                      <span className="ml-2 capitalize">{column}</span>
                      <Badge
                        className="ml-auto rounded-full"
                        variant="secondary"
                      >
                        {tasksState[column].length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <Droppable droppableId={column}>
                    {(provided) => (
                      <CardContent
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px] bg-transparent p-4"
                      >
                        {tasksState[column].map((task: Task, index: number) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => {
                              const { icon: LabelIcon, variant } =
                                getLabelBadgeVariantAndIcon(task.label)
                              const { icon: PriorityIcon, color } =
                                getPriorityIcon(task.priority)
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3 rounded-xl border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-sm font-medium">
                                        {task.title}
                                      </h3>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                          >
                                            <MoreVertical className="size-4" />
                                            <span className="sr-only">
                                              More options
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={variant}
                                        className="capitalize"
                                      >
                                        {
                                          <LabelIcon
                                            className={cn("mr-1 size-4")}
                                          />
                                        }
                                        {task.label}
                                      </Badge>
                                      <Badge
                                        className="capitalize"
                                        variant="outline"
                                      >
                                        <PriorityIcon
                                          className={cn("mr-2 size-4", color)}
                                        />
                                        {task.priority}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="size-6">
                                          <AvatarImage src="#" />
                                          <AvatarFallback>TK</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-gray-500">
                                          Tako Kikoria
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar
                                          className={cn(
                                            "size-3.5",
                                            isPast(task.dueDate)
                                              ? "text-destructive"
                                              : undefined
                                          )}
                                        />
                                        <span
                                          className={cn(
                                            "text-xs",
                                            isPast(task.dueDate)
                                              ? "text-destructive"
                                              : undefined
                                          )}
                                        >
                                          {formatDistance(
                                            new Date(),
                                            task.dueDate
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </CardContent>
                    )}
                  </Droppable>
                </Card>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DragDropContext>
  )
}
