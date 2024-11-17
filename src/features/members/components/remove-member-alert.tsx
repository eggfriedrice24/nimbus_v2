"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { TailSpin } from "@/components/tailspin"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useDeleteMember } from "../services/use-delete-member"

export function RemoveMemberAlert({ memberId }: { memberId: string }) {
  const { mutate, isPending } = useDeleteMember()

  const router = useRouter()

  const handleDelete = async () => {
    mutate(
      { param: { memberId } },
      {
        onSuccess: () => {
          void router.push(`/`)
        },
      }
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          aria-label="Delete member from workspace"
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove selected
            member from workspace and remove all associated data from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            type="button"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <TailSpin />
                Removing...
              </>
            ) : (
              "Yes, remove member"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
