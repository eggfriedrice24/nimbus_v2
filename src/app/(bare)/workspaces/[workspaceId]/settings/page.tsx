import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/lib/queries"
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form"
import { getWorkspace } from "@/features/workspaces/lib/queries"
import {
  AlertCircle,
  BriefcaseBusiness,
  ChevronLeft,
  Trash,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DottedSeparator } from "@/components/ui/separator"

export default async function GeneralSettings({
  params,
}: {
  params: { workspaceId: string }
}) {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  const workspace = await getWorkspace(params.workspaceId)

  if (!workspace) {
    redirect(`/workspaces/${params.workspaceId}`)
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Link
        href={`/workspaces/${params.workspaceId}`}
        className="mb-4 flex items-center text-primary"
      >
        <ChevronLeft className="mr-2 size-4" />
        Back to Workspace
      </Link>
      <h1 className="mb-8 text-3xl font-bold">Workspace Settings</h1>
      <div className="space-y-8">
        <Card className="border border-border bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Update Workspace</CardTitle>
                <CardDescription>
                  Modify your workspace details below.
                </CardDescription>
              </div>
              <BriefcaseBusiness className="size-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <UpdateWorkspaceForm initialValues={{ ...workspace }} />
          </CardContent>
        </Card>

        <DottedSeparator />

        <Card className="border border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Deleting this workspace is permanent and cannot be undone. All
                data related to it will be permanently removed from our servers.
              </AlertDescription>
            </Alert>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="mt-4 w-full">
                  Delete Workspace <Trash className="ml-2 size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your workspace and remove all associated data from our
                    servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="destructive">Yes, delete workspace</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
