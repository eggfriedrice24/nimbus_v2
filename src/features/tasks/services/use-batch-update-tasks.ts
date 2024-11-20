import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["batch-update"]["$post"]
>
type RequestType = InferRequestType<
  (typeof client.api.tasks)["batch-update"]["$post"]
>

export function useBatchUpdateTasks() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["batch-update"].$post({
        json,
      })

      if (!response.ok) {
        throw new Error("Failed to Update Tasks in Batch! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Tasks Batch Updated Successfully! 🎉")
      void queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      toast.error("Failed to Update Tasks in Batch! ❌")
    },
  })

  return mutation
}
