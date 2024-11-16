import { getServerSession } from "@/features/auth/lib/queries"
import { getMember } from "@/features/members/lib/queries"
import { db } from "@/server/db"
import { members } from "@/server/db/schema"

export async function getWorkspaces() {
  const session = await getServerSession()

  if (!session) {
    return []
  }

  const workspacesList = await db.query.workspaces.findMany({
    with: {
      user: true,
      members: true,
    },
    where: (workspaces, { exists, eq, and }) =>
      and(
        exists(
          db
            .select()
            .from(members)
            .where(eq(members.workspaceId, workspaces.id))
        ),
        eq(workspaces.userId, session?.id ?? "")
      ),
  })

  return workspacesList
}

export async function getWorkspace(workspaceId: string) {
  const session = await getServerSession()

  if (!session) {
    return null
  }

  const member = await getMember(workspaceId, session.id)

  if (!member) {
    return null
  }

  const workspace = await db.query.workspaces.findFirst({
    with: {
      user: true,
      members: true,
    },
    where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
  })

  return workspace
}
