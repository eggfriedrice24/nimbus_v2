import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { client } from "@/server/rpc"

import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>

export function useJoinWorkspace() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[":workspaceId"].join.$post({
        param,
        json,
      })

      if (!response.ok) {
        throw new Error("Failed to Reset Invite Code! ❌")
      }

      return await response.json()
    },
    onSuccess: ({ workspace }) => {
      toast.success("Congratulations you have joined workspace 🎉")
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", workspace.id],
      })
    },
    onError: () => {
      toast.error("Failed to join workspace! ❌")
    },
  })

  return mutation
}
