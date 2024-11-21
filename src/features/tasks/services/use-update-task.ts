import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>

export function useUpdateTask({
  dialogOpen,
}: {
  dialogOpen: (value: boolean) => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ query, json, param }) => {
      const response = await client.api.tasks[":taskId"].$patch({
        query,
        json,
        param,
      })

      if (!response.ok) {
        throw new Error("Failed to Update Task! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Task Updated Successfully! 🎉")

      void queryClient.invalidateQueries({ queryKey: ["tasks"] })

      void dialogOpen(false)
    },
    onError: () => {
      toast.error("Failed to Update Task! ❌")
    },
  })

  return mutation
}
