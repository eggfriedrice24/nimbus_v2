import { db } from "@/server/db"

export const getMember = (workspaceId: string, userId: string) => {
  const member = db.query.members.findFirst({
    with: {
      user: true,
      workspace: true,
    },
    where: (members, { eq, and }) =>
      and(eq(members.userId, userId), eq(members.workspaceId, workspaceId)),
  })

  return member
}
