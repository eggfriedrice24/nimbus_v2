import { useQuery } from "@tanstack/react-query"
import { type InferResponseType } from "hono"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<typeof client.api.projects.$get>

export function useGetProjects({ workspaceId }: { workspaceId: string }) {
  const mutation = useQuery<ResponseType>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await client.api.projects.$get({ query: { workspaceId } })

      if (!res.ok) {
        throw new Error("Failed to fetch projects! ❌")
      }

      const projects = await res.json()

      return projects
    },
  })

  return mutation
}
