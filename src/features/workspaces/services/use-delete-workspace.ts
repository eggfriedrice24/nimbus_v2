import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"].$delete({
        param,
      })

      if (!response.ok) {
        throw new Error("Failed to Delete Workspace! ❌")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace Deleted Successfully! 🎉")
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", data?.id],
      })
    },
    onError: () => {
      toast.error("Failed to Delete Workspace! ❌")
    },
  })

  return mutation
}
