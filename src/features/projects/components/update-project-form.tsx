"use client"

import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { BriefcaseBusiness, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { patchProjectschema, type Project } from "@/server/db/schema/projects"

import { useProjectId } from "../hooks/use-project-id"
import { useUpdateProject } from "../services/use-update-project"

type UpdateProjectSchemaType = z.infer<typeof patchProjectschema>

export function UpdateProjectForm({
  initialValues,
}: {
  initialValues: Partial<Project>
}) {
  const { mutate, isPending } = useUpdateProject()
  const projectId = useProjectId()
  const workspaceId = useWorkspaceId()

  const form = useForm<UpdateProjectSchemaType>({
    resolver: zodResolver(patchProjectschema),
    defaultValues: {
      name: initialValues.name,
      emoji: initialValues.emoji,
    },
  })

  function onSubmit(input: UpdateProjectSchemaType) {
    mutate(
      { json: input, param: { projectId }, query: { workspaceId } },
      {
        onSuccess: () => {
          form.reset()
        },
      }
    )
  }

  return (
    <Card className="border-none bg-secondary/50">
      <div className="flex items-center justify-between pr-6">
        <CardHeader>
          <CardTitle>Update Project</CardTitle>
          <CardDescription>Modify your project details below.</CardDescription>
        </CardHeader>

        <BriefcaseBusiness className="size-8 text-primary" />
      </div>

      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
