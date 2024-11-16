"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus2, UserX } from "lucide-react"

import { TailSpin } from "@/components/tailspin"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Workspace } from "@/server/db/schema/workspaces"

import { useInviteCode } from "../hooks/use-invite-code"
import { useWorkspaceId } from "../hooks/use-workspace-id"
import { useJoinWorkspace } from "../services/use-join-workspace"

export default function JoinWorkspaceForm({
  initialValues,
}: {
  initialValues: Partial<Workspace>
}) {
  const workspaceId = useWorkspaceId()
  const inviteCode = useInviteCode()
  const router = useRouter()
  const { mutate, isPending } = useJoinWorkspace()

  const handleJoinWorkspace = async () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode ?? "" },
      },
      {
        onSuccess: ({ workspace }) =>
          router.push(`/workspaces/${workspace.id}`),
      }
    )
  }

  return (
    <Card className="w-full border-none bg-secondary/50">
      <CardHeader>
        <CardTitle>Join Workspace: {initialValues.name ?? "Unnamed"}</CardTitle>
        <CardDescription>
          You have been invited to collaborate in this workspace. Enter the
          invitation code below to confirm your membership.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="code">Invitation Code</Label>
        <Input
          id="code"
          type="text"
          placeholder="Enter invitation code"
          value={inviteCode ?? ""}
          disabled
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={handleJoinWorkspace}
          disabled={isPending}
        >
          <UserPlus2 className="mr-2 size-4" />
          {isPending ? (
            <>
              <TailSpin /> Joining...
            </>
          ) : (
            "Accept Invitation"
          )}
        </Button>

        <Button
          variant="destructive"
          type="button"
          disabled={isPending}
          asChild
        >
          <Link href={`/`}>
            <UserX className="mr-2 size-4" />
            Reject Invitation
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
