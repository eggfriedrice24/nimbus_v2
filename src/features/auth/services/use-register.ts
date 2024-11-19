import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { client } from "@/server/rpc"

import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<typeof client.api.auth.register.$post>
type RequestType = InferRequestType<typeof client.api.auth.register.$post>

export function useRegister() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register.$post(json)
      if (!response.ok) {
        throw new Error("Failed to Register! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("User Created! You can now Log In. 🎉")
      router.push('/sign-in')
      void queryClient.invalidateQueries({ queryKey: ["session"] })
    },
    onError: () => {
      toast.error("Failed to Create User! ❌")
    },
  })

  return mutation
}
