"use client"

import { client } from "@/server/rpc"
import { useQuery } from "@tanstack/react-query"

export default function Home() {
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await client.api.tasks.$get()

      if (!response.ok) {
        throw new Error("sss")
      }

      const d = await response.json()

      return d
    },
  })

  return (
    <div>
      {query.isPending
        ? "loading...."
        : query.data?.map((i) => <div key={i.id}>{i.title}</div>)}
    </div>
  )
}
