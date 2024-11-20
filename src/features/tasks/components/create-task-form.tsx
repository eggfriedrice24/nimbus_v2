"use client"

import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useGetMembers } from "@/features/members/services/use-get-members"
import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { cn } from "@/lib/utils"
import { tasks } from "@/server/db/schema"
import { insertTasksSchema } from "@/server/db/schema/tasks"

import {
  getLabelBadgeVariantAndIcon,
  getPriorityIcon,
  getStatusIcon,
} from "../lib/utils"
import { useCreateTask } from "../services/use-create-task"

type CreateTaskSchemaType = z.infer<typeof insertTasksSchema>

export function CreateTaskForm() {
  const workspaceId = useWorkspaceId()
  const projectId = useProjectId()

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  })

  const { mutate, isPending } = useCreateTask()

  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(insertTasksSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
      label: "bug",
    },
  })

  function onSubmit(input: CreateTaskSchemaType) {
    const transformedInput = {
      ...input,
    }

    mutate({
      json: transformedInput,
      query: {
        workspaceId,
        projectId,
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Due Date <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-9 w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Assignee <span className="text-xs text-destructive">*</span>
              </FormLabel>
              {membersLoading && <Skeleton className="h-9 rounded" />}
              {!membersLoading && members?.data && (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {members.data.map((m) => (
                      <SelectItem key={m.id} value={m.user.id}>
                        {m.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                {/* @ts-expect-error sad */}
                <Textarea
                  placeholder="Enter task description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {tasks.status.enumValues.map((item) => {
                        const { icon: Icon, color } = getStatusIcon(item)
                        return (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Label <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select Label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {tasks.label.enumValues.map((item) => {
                        const { icon: Icon, variant } =
                          getLabelBadgeVariantAndIcon(item)
                        return (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            <Badge variant={variant}>
                              <Icon className={cn("mr-2 size-4")} />
                              {item}
                            </Badge>
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Priority <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {tasks.priority.enumValues.map((item) => {
                        const { icon: Icon, color } = getPriorityIcon(item)

                        return (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="archived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Archived</FormLabel>
                <FormDescription>Mark this task as archived</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending && (
            <ReloadIcon
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Create Task
        </Button>
      </form>
    </Form>
  )
}
