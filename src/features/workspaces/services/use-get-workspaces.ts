import { client } from "@/server/rpc"
import { useQuery } from "@tanstack/react-query"
import { type InferResponseType } from "hono"

type ResponseType = InferResponseType<typeof client.api.workspaces.$get>

export function useGetWorkspaces() {
  const mutation = useQuery<ResponseType>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await client.api.workspaces.$get()

      if (!res.ok) {
        throw new Error("Failed to fetch workspaces! ❌")
      }

      const workspaces = await res.json()

      return workspaces
    },
  })

  return mutation
}
