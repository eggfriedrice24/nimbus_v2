import { getServerSession } from "@/features/auth/lib/queries"
import { getMember } from "@/features/members/lib/queries"
import { db } from "@/server/db"

export async function getProject({
  projectId,
  workspaceId,
}: {
  projectId: string
  workspaceId: string
}) {
  const session = await getServerSession()

  if (!session) {
    return null
  }

  const member = await getMember(workspaceId, session.id)

  if (!member) {
    throw new Error("Unauthorized.")
  }

  const project = await db.query.projects.findFirst({
    with: {
      user: true,
      workspace: true,
    },
    where: (projects, { eq }) => eq(projects.id, projectId),
  })

  return project
}
