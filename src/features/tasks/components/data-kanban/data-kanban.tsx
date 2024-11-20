"use client"

import * as React from "react"

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { type Task } from "@/server/db/schema/tasks"

import { KanbanCard } from "./kanban-card"
import { KanbanColumnHeader } from "./kanban-col-header"

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

      // @ts-expect-error sad
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
            return (
              <div key={column} className="w-80 shrink-0">
                <Card className="rounded-xl">
                  <KanbanColumnHeader
                    column={column}
                    count={tasksState[column].length}
                  />

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
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3 rounded-xl border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                  <KanbanCard task={task} />
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
