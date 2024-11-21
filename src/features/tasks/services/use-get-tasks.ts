import { useQuery } from "@tanstack/react-query"
import { type InferResponseType } from "hono"
import { type z } from "zod"

import { type selectTasksSchema } from "@/server/db/schema/tasks"
import { client } from "@/server/rpc"

type ResponseType = InferResponseType<typeof client.api.tasks.$get>

interface useGetTasksProps {
  filters: z.infer<typeof selectTasksSchema>
}

export function useGettasks({ filters }: useGetTasksProps) {
  const mutation = useQuery<ResponseType>({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const {
        workspaceId,
        projectId,
        assigneeId,
        status,
        label,
        priority,
        title,
        dueDate,
      } = filters
      const res = await client.api.tasks.$get({
        query: {
          workspaceId: workspaceId,
          projectId: projectId ?? undefined,
          assigneeId: assigneeId ?? undefined,
          status: status ?? undefined,
          label: label ?? undefined,
          priority: priority ?? undefined,
          title: title ?? undefined,
          dueDate: dueDate?.toString() ?? undefined,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch tasks! ❌")
      }

      const tasks = await res.json()

      return tasks
    },
  })

  return mutation
}
