"use client"

import * as React from "react"

// import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetWorkspaces } from "@/features/workspaces/services/use-get-workspaces"
import { insertProjectschema } from "@/server/db/schema/projects"

import { useCreateProject } from "../services/use-create-project"

type CreateProjectSchemaType = z.infer<typeof insertProjectschema>

export function CreateProjectForm() {
  const { mutate, isPending } = useCreateProject()
  // const router = useRouter()

  const { data } = useGetWorkspaces()

  const form = useForm<CreateProjectSchemaType>({
    resolver: zodResolver(insertProjectschema),
    defaultValues: {
      name: "",
      emoji: "🚀",
      workspaceId: "",
    },
  })

  function onSubmit(input: CreateProjectSchemaType) {
    mutate(
      { json: input },
      {
        onSuccess: () => {
          form.reset()
          // TODO: redirect to projects screen. void router.push(`/projects`)
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="workspaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workspace" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {data?.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex w-full items-center gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter Project name..."
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji</FormLabel>
                <FormControl>
                  <Input
                    id="emoji"
                    type="text"
                    placeholder="🚀"
                    className="w-14"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="mt-4 w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </form>
    </Form>
  )
}
