import { client } from "@/server/rpc"
import { useQuery } from "@tanstack/react-query"

export function useSession() {
  const mutation = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await client.api.auth.current.$get()

      if (!res.ok) {
        return null
      }

      const session = await res.json()

      return session
    },
  })

  return mutation
}
