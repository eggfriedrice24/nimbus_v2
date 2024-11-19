import { useParams } from "next/navigation"

export function useProjectId() {
  const params = useParams<{ projectId: string }>()

  return params.projectId
}
