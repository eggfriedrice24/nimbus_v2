import { client } from "@/server/rpc"
import { useQuery } from "@tanstack/react-query"

export function useGetWorkspaces() {
  const mutation = useQuery({
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
