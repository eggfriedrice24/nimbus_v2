import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>

export function useDeleteProject() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, query }) => {
      const response = await client.api.projects[":projectId"].$delete({
        param,
        query,
      })

      if (!response.ok) {
        throw new Error("Failed to Delete Project! ❌")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success("Project Deleted Successfully! 🎉")
      router.refresh()
      router.push(`/workspaces/${data?.id}`)

      void queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: () => {
      toast.error("Failed to Delete Project! ❌")
    },
  })

  return mutation
}
