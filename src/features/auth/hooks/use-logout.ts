import { useRouter } from "next/navigation"
import { client } from "@/server/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferResponseType } from "hono"

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post()
      return await response.json()
    },
    onSuccess: () => {
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["session"] })
    },
  })

  return mutation
}
