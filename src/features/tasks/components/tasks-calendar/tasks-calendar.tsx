"use client"

import { format, isSameDay, isSameMonth } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useCalendar } from "@/hooks/use-calendar"
import { cn } from "@/lib/utils"
import { type Task } from "@/server/db/schema/tasks"

import { TaskItem } from "./task-item"

export default function TasksCalendar({ tasks }: { tasks: Task[] }) {
  const {
    calendarDays,
    nextMonth,
    previousMonth,
    formattedMonth,
    weekdays,
    currentDate,
  } = useCalendar()

  return (
    <Card className="h-max">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
        <CardTitle className="text-2xl font-bold">{formattedMonth}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="size-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-2 grid grid-cols-7 gap-4 font-semibold">
          {weekdays.map((day) => (
            <div key={day} className="font-bold">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {calendarDays.map((day) => {
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, currentDate)

            const tasksForDay = tasks.filter((task) =>
              isSameDay(new Date(task.dueDate), day)
            )
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "h-[5.5rem] rounded-lg border p-1",
                  isCurrentMonth
                    ? "bg-background"
                    : "bg-sidebar/80 backdrop-blur-lg"
                )}
              >
                <div className="mb-1 text-sm font-semibold">
                  <span
                    className={cn(
                      isToday &&
                        "rounded-full bg-primary px-1 text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <ScrollArea className="max-h-[calc(100%-1.5rem)]">
                  {tasksForDay.map((task) => (
                    <TaskItem task={task} key={task.id} />
                  ))}
                  <ScrollBar />
                </ScrollArea>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
