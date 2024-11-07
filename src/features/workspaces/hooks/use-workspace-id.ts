import { useParams } from "next/navigation"

export function useWorkspaceId() {
  const params = useParams<{ workspaceId: string }>()

  return params.workspaceId
}
