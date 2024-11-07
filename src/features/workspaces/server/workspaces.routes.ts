import { db } from "@/server/db"
import { workspaces } from "@/server/db/schema"
import { MemberRole, members } from "@/server/db/schema/members"
import { sessionMiddleware } from "@/server/session-middleware"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"

import { generateInviteCode } from "@/lib/utils"

import { createWorkspaceSchema } from "../schemas/validations"

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user")

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
          eq(workspaces.userId, user.id ?? "")
        ),
    })

    return c.json(workspacesList)
  })
  .post(
    "/",
    zValidator("json", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name } = c.req.valid("json")
      const user = c.get("user")

      const insertedWorkspace = (await db.transaction(async (trx) => {
        const [workspace] = await trx
          .insert(workspaces)
          .values({
            name,
            userId: user.id ?? "",
            inviteCode: generateInviteCode(10),
          })
          .returning()

        if (workspace) {
          await trx
            .insert(members)
            .values({
              userId: user.id ?? "",
              workspaceId: workspace.id,
              role: MemberRole.ADMIN,
            })
            .returning()
        }

        return workspace
      }))!

      return c.json(insertedWorkspace, HttpStatusCodes.OK)
    }
  )

export default app
