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
import { type Task } from "@/server/db/schema/tasks"

import { useDeleteTask } from "../services/use-delete-task"

export function DeleteTaskAlert({
  open,
  onOpenChange,
  task,
}: {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  task: Task
}) {
  const { mutate, isPending } = useDeleteTask({ dialogOpen: onOpenChange })

  const handleDelete = async () => {
    mutate({ param: { taskId: task.id } })
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
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
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
