"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { BriefcaseBusiness, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

import { useCreateWorkspace } from "../hooks/use-create-workspace"
import {
  createWorkspaceSchema,
  type CreateWorkspaceSchemaType,
} from "../schemas/validations"

export default function CreateWorkspaceForm() {
  const { mutate, isPending } = useCreateWorkspace()

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
        onSuccess: () => {
          form.reset()
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-md overflow-hidden shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">
              Create Workspace
            </CardTitle>
            <CardDescription>
              Enter a name for your new workspace and start collaborating!
            </CardDescription>
          </div>

          <BriefcaseBusiness className="size-16 text-white" />
        </div>
      </CardHeader>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
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
          </CardContent>
          <CardFooter>
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
