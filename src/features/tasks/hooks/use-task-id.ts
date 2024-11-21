import { useParams } from "next/navigation"

export function useTaskId() {
  const params = useParams<{ taskId: string }>()

  return params.taskId
}
