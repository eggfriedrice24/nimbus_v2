import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { client } from "@/server/rpc"

import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<typeof client.api.projects.$post>
type RequestType = InferRequestType<typeof client.api.projects.$post>

export function useCreateProject() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.projects.$post(json)

      if (!response.ok) {
        throw new Error("Failed to Create Project! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Project Created Successfully! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: () => {
      toast.error("Failed to Create Project! ❌")
    },
  })

  return mutation
}
