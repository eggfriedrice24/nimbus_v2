"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { BriefcaseBusiness, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"

import { useCreateWorkspace } from "../hooks/use-create-workspace"
import {
  createWorkspaceSchema,
  type CreateWorkspaceSchemaType,
} from "../schemas/validations"

export default function CreateWorkspaceForm({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <div className="flex items-start justify-between">
              <div>
                <DrawerTitle className="text-3xl font-bold">
                  Create Workspace
                </DrawerTitle>
                <DrawerDescription>
                  Enter a name for your new workspace and start collaborating!
                </DrawerDescription>
              </div>

              <BriefcaseBusiness className="size-16 text-white" />
            </div>
          </DrawerHeader>

          <div className="p-4">
            <CreateWorkspaceCard />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold">
                Create Workspace
              </DialogTitle>

              <DialogDescription className="text-sm text-muted-foreground">
                Enter a name for your new workspace and start collaborating!
              </DialogDescription>
            </div>

            <BriefcaseBusiness className="size-16 text-white" />
          </div>
        </DialogHeader>

        <CreateWorkspaceCard />
      </DialogContent>
    </Dialog>
  )
}
function CreateWorkspaceCard() {
  const { mutate, isPending } = useCreateWorkspace()

  const router = useRouter()

  const form = useForm<CreateWorkspaceSchemaType>({
    resolver: zodResolver(createWorkspaceSchema),
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
      <form className="grid gap-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
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
