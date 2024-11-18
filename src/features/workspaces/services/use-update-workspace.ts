import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { client } from "@/server/rpc"

import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspaces[":workspaceId"].$patch({
        json,
        param,
      })

      if (!response.ok) {
        throw new Error("Failed to Update Workspace! ❌")
      }

      return await response.json()
    },
    onSuccess: (data) => {
      toast.success("Workspace Updated Successfully! 🎉")
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      void queryClient.invalidateQueries({ queryKey: ["workspace", data.id] })
    },
    onError: () => {
      toast.error("Failed to Update Workspace! ❌")
    },
  })

  return mutation
}
