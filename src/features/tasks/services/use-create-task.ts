import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<typeof client.api.tasks.$post>
type RequestType = InferRequestType<typeof client.api.tasks.$post>

export function useCreateTask() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ query, json }) => {
      const response = await client.api.tasks.$post({ query, json })

      if (!response.ok) {
        throw new Error("Failed to Create Task! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Task Created Successfully! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      toast.error("Failed to Create Task! ❌")
    },
  })

  return mutation
}
