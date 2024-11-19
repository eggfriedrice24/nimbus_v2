"use client"

import { AlertCircle, Trash } from "lucide-react"

import { TailSpin } from "@/components/tailspin"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import { useProjectId } from "../hooks/use-project-id"
import { useDeleteProject } from "../services/use-delete-project"

export function DeleteProjectAlert() {
  const projectId = useProjectId()
  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useDeleteProject()

  const handleDelete = async () => {
    mutate({ param: { projectId }, query: { workspaceId } })
  }

  return (
    <Card className="border-none bg-secondary/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Deleting this project is permanent and cannot be undone. All data
            related to it will be permanently removed from our servers.
          </AlertDescription>
        </Alert>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-4 w-full">
              Delete Project <Trash className="ml-2 size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                project and remove all associated data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                type="button"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <TailSpin />
                    Deleting...
                  </>
                ) : (
                  "Yes, delete project"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
