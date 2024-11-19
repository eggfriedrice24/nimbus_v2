import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>

export function useUpdateProject() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param, query }) => {
      const response = await client.api.projects[":projectId"].$patch({
        json,
        param,
        query,
      })

      if (!response.ok) {
        throw new Error("Failed to Update Project! ❌")
      }

      return await response.json()
    },
    onSuccess: (data) => {
      toast.success("Project Updated Successfully! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
      void queryClient.invalidateQueries({ queryKey: ["project", data.id] })
    },
    onError: () => {
      toast.error("Failed to Update Project! ❌")
    },
  })

  return mutation
}
