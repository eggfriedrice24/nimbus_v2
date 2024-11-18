"use client"

import { useRouter } from "next/navigation"

import { Check, Copy, RefreshCw } from "lucide-react"

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
import { useCopy } from "@/hooks/use-copy"
import { type Workspace } from "@/server/db/schema/workspaces"

import { useWorkspaceId } from "../hooks/use-workspace-id"
import { useResetInviteCode } from "../services/use-reset-invite-code"

export default function ResetInviteCard({
  initialValues,
}: {
  initialValues: Partial<Workspace>
}) {
  const workspaceId = useWorkspaceId()

  const router = useRouter()

  const { mutate, isPending } = useResetInviteCode()

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/workspaces/${workspaceId}/join/${initialValues.inviteCode}`
      : ""

  const { isCopied, copyToClipboard } = useCopy()

  const handleReset = async () => {
    mutate({ param: { workspaceId } }, { onSuccess: () => router.refresh() })
  }

  return (
    <Card className="w-full border-none bg-secondary/50">
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Share this invite code with people you want to join your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <Label htmlFor="invite-code">Invite Code</Label>
          <div className="flex space-x-2">
            <Input id="invite-code" value={inviteLink} readOnly disabled />
            <Button
              onClick={() => copyToClipboard(inviteLink)}
              size="icon"
              variant="secondary"
              disabled={isCopied || isPending}
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              <span className="sr-only">Copy invite code</span>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={handleReset}
          disabled={isPending}
        >
          <RefreshCw className="mr-2 size-4" />
          Regenerate Code
        </Button>
      </CardFooter>
    </Card>
  )
}
