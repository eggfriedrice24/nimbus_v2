"use client"

import * as React from "react"

import { useRouter } from "next/navigation"

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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { patchWorkspaceSchema } from "@/server/db/schema/workspaces"
import type { Workspace } from "@/server/db/schema/workspaces"

import { useWorkspaceId } from "../hooks/use-workspace-id"
import { useUpdateWorkspace } from "../services/use-update-workspace"

type UpdateWorkspaceSchemaType = z.infer<typeof patchWorkspaceSchema>

export function UpdateWorkspaceForm({
  initialValues,
}: {
  initialValues: Partial<Workspace>
}) {
  const { mutate, isPending } = useUpdateWorkspace()
  const workspaceId = useWorkspaceId()

  const router = useRouter()

  const form = useForm<UpdateWorkspaceSchemaType>({
    resolver: zodResolver(patchWorkspaceSchema),
    defaultValues: {
      name: initialValues.name,
    },
  })

  function onSubmit(input: UpdateWorkspaceSchemaType) {
    mutate(
      { json: input, param: { workspaceId } },
      {
        onSuccess: (data) => {
          form.reset()
          void router.push(`/workspaces/${data.id}`)
        },
      }
    )
  }

  return (
    <Card className="border-none bg-secondary/50">
      <div className="flex items-center justify-between pr-6">
        <CardHeader>
          <CardTitle>Update Workspace</CardTitle>
          <CardDescription>
            Modify your workspace details below.
          </CardDescription>
        </CardHeader>

        <BriefcaseBusiness className="size-8 text-primary" />
      </div>

      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Workspace Name</Label>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Enter workspace name..."
                        disabled={isPending}
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
                "Update Workspace"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
