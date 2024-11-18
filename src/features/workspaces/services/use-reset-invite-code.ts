import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { client } from "@/server/rpc"

import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>

export function useResetInviteCode() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ].$post({
        param,
      })

      if (!response.ok) {
        throw new Error("Failed to Reset Invite Code! ❌")
      }

      return await response.json()
    },
    onSuccess: (data) => {
      toast.success("Workspace Invite Code Reset Successful 🎉")
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", data?.id],
      })
    },
    onError: () => {
      toast.error("Failed to Reset Invite Code! ❌")
    },
  })

  return mutation
}
