import { useParams } from "next/navigation"

export function useInviteCode() {
  const params = useParams<{ inviteCode: string }>()

  return params.inviteCode
}
