import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["batch-update"]["$patch"]
>
type RequestType = InferRequestType<
  (typeof client.api.tasks)["batch-update"]["$patch"]
>

export function useBatchUpdateTasks() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ query, json }) => {
      const response = await client.api.tasks["batch-update"].$patch({
        query,
        json,
      })

      if (!response.ok) {
        throw new Error("Failed to Update Tasks in Batch! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Tasks Batch, Updated Successfully! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      toast.error("Failed to Update Tasks in Batch! ❌")
    },
  })

  return mutation
}
