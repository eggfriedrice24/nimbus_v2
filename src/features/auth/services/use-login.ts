import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { client } from "@/server/rpc"

import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<typeof client.api.auth.login.$post>
type RequestType = InferRequestType<typeof client.api.auth.login.$post>

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login.$post(json)
      if (!response.ok) {
        throw new Error("Failed to Log In! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["session"] })
    },
    onError: () => {
      toast.error("Failed to Log In! ❌")
    },
  })

  return mutation
}
