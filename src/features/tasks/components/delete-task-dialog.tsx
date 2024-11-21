"use client"

import { TailSpin } from "@/components/tailspin"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useTaskId } from "../hooks/use-task-id"
import { useDeleteTask } from "../services/use-delete-task"

export function DeleteTaskAlert({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const taskId = useTaskId()

  const { mutate, isPending } = useDeleteTask()

  const handleDelete = async () => {
    mutate({ param: { taskId } })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your task
            and remove all associated data from our servers.
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
              "Yes, delete task"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
