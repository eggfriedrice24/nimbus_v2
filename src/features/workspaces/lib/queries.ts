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
    where: (workspaces, { exists, eq, or, and }) =>
      or(
        eq(workspaces.userId, session.id),

        exists(
          db
            .select()
            .from(members)
            .where(
              and(
                eq(members.workspaceId, workspaces.id),
                eq(members.userId, session.id)
              )
            )
        )
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
    throw new Error("Unauthorized.")
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

export async function getWorkspaceInfo(workspaceId: string) {
  const workspace = await db.query.workspaces.findFirst({
    where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
  })

  if (!workspace) {
    return null
  }

  return { name: workspace.name }
}
