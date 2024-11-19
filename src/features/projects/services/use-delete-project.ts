import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":workspaceId"]["$delete"]
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[":workspaceId"]["$delete"]
>

export function useDeleteProject() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (param) => {
      const response = await client.api.projects[":workspaceId"].$delete(param)

      if (!response.ok) {
        throw new Error("Failed to Delete Project! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Project Deleted Successfully! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: () => {
      toast.error("Failed to Delete Project! ❌")
    },
  })

  return mutation
}
