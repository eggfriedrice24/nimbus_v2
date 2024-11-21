import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>

export function useDeleteTask({
  dialogOpen,
}: {
  dialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"].$delete({
        param,
      })

      if (!response.ok) {
        throw new Error("Failed to Delete Task! ❌")
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success("Task Deleted Successfully! 🎉")

      void queryClient.invalidateQueries({ queryKey: ["tasks"] })
      void queryClient.invalidateQueries({
        queryKey: ["tasks", data?.id],
      })

      dialogOpen(false)
    },
    onError: () => {
      toast.error("Failed to Delete Task! ❌")
    },
  })

  return mutation
}
