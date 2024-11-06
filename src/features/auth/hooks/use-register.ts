"use client"

import { useRouter } from "next/navigation"
import { client } from "@/server/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"

type ResponseType = InferResponseType<typeof client.api.auth.register.$post>
type RequestType = InferRequestType<typeof client.api.auth.register.$post>

export function useRegister() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register.$post(json)
      return await response.json()
    },
    onSuccess: () => {
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["session"] })
    },
  })

  return mutation
}
