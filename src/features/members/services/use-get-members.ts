import { useQuery } from "@tanstack/react-query"
import { type InferResponseType } from "hono"

import { client } from "@/server/rpc"

type ResponseType = InferResponseType<typeof client.api.members.$get>

export function useGetMembers({ workspaceId }: { workspaceId: string }) {
  const mutation = useQuery<ResponseType>({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const res = await client.api.members.$get({ query: { workspaceId } })

      if (!res.ok) {
        throw new Error("Failed to fetch members! ❌")
      }

      const members = await res.json()

      return members
    },
  })

  return mutation
}
