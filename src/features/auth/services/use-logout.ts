import { useRouter } from "next/navigation"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferResponseType } from "hono"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post()
      if (!response.ok) {
        throw new Error("Failed to Logout! ❌")
      }
      return await response.json()
    },
    onSuccess: () => {
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["session"] })
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })

  return mutation
}
