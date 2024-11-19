import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":workspaceId"]["$patch"]
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[":workspaceId"]["$patch"]
>

export function useUpdateProject() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.projects[":workspaceId"].$patch({
        json,
        param,
      })

      if (!response.ok) {
        throw new Error("Failed to Update Project! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Project Updated Successfully! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: () => {
      toast.error("Failed to Update Project! ❌")
    },
  })

  return mutation
}
