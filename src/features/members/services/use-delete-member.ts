import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { client } from "@/server/rpc"

import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"]
>
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>

export function useDeleteMember() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"].$delete({
        param,
      })

      if (!response.ok) {
        throw new Error("Failed to Delete Member! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Member Deleted Successfully! 🎉")
      void queryClient.invalidateQueries({ queryKey: ["members"] })
    },
    onError: () => {
      toast.error("Failed to Delete Member! ❌")
    },
  })

  return mutation
}
