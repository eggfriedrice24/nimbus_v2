"use client"

import { useRouter } from "next/navigation"
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

import { useWorkspaceId } from "../hooks/use-workspace-id"
import { useDeleteWorkspace } from "../services/use-delete-workspace"

export function DeleteWorkspaceAlert() {
  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useDeleteWorkspace()

  const router = useRouter()

  const handleDelete = async () => {
    mutate(
      { param: { workspaceId } },
      {
        onSuccess: () => {
          void router.push(`/`)
        },
      }
    )
  }

  return (
    <Card className="border border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-2xl text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Deleting this workspace is permanent and cannot be undone. All data
            related to it will be permanently removed from our servers.
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
                This action cannot be undone. This will permanently delete your
                workspace and remove all associated data from our servers.
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
                    Updating...
                  </>
                ) : (
                  "Yes, delete workspace"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
