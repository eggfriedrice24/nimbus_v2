import { db } from "@/server/db"
import { members } from "@/server/db/schema"

import { getServerSession } from "../auth/queries"

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
