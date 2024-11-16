import { useRouter } from "next/navigation"
import { client } from "@/server/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.workspaces.$post>
type RequestType = InferRequestType<typeof client.api.workspaces.$post>

export function useCreateWorkspace() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.workspaces.$post(json)

      if (!response.ok) {
        throw new Error("Failed to Create Workspace! ❌")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Workspace Created Successfully! 🎉")
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: () => {
      toast.error("Failed to Create Workspace! ❌")
    },
  })

  return mutation
}
