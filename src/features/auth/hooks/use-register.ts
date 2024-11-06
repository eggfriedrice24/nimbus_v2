"use client"

import { useRouter } from "next/navigation"
import { client } from "@/server/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

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
      toast.success("User Created! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["session"] })
    },
    onError: () => {
      toast.error("Failed to Create Workspace! ❌")
    },
  })

  return mutation
}
