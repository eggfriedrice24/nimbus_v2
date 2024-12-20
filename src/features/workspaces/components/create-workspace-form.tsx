"use client"

import * as React from "react"

import { useRouter } from "next/navigation"

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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { insertWorkspaceSchema } from "@/server/db/schema/workspaces"

import { useCreateWorkspace } from "../services/use-create-workspace"

type CreateWorkspaceSchemaType = z.infer<typeof insertWorkspaceSchema>

export function CreateWorkspaceForm() {
  const { mutate, isPending } = useCreateWorkspace()
  const router = useRouter()

  const form = useForm<CreateWorkspaceSchemaType>({
    resolver: zodResolver(insertWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(input: CreateWorkspaceSchemaType) {
    mutate(
      { json: input },
      {
        onSuccess: (data) => {
          form.reset()
          void router.push(`/workspaces/${data.id}`)
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
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
              Creating...
            </>
          ) : (
            "Create Workspace"
          )}
        </Button>
      </form>
    </Form>
  )
}
