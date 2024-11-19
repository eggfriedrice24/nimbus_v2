import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"
import * as HttpStatusPhrases from "stoker/http-status-phrases"
import { z } from "zod"

import { getMember } from "@/features/members/lib/queries"
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants"
import { generateInviteCode } from "@/lib/utils"
import { db } from "@/server/db"
import { workspaces } from "@/server/db/schema"
import { MemberRole, members } from "@/server/db/schema/members"
import {
  insertWorkspaceSchema,
  patchWorkspaceSchema,
} from "@/server/db/schema/workspaces"
import { sessionMiddleware } from "@/server/session-middleware"

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user")

    const workspacesList = await db.query.workspaces.findMany({
      with: {
        user: true,
        members: true,
      },
      where: (workspaces, { exists, eq, or, and }) =>
        or(
          eq(workspaces.userId, user.id ?? ""),

          exists(
            db
              .select()
              .from(members)
              .where(
                and(
                  eq(members.workspaceId, workspaces.id),
                  eq(members.userId, user.id ?? "")
                )
              )
          )
        ),
    })

    return c.json(workspacesList)
  })
  .post(
    "/",
    zValidator("json", insertWorkspaceSchema),
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
  .patch(
    "/:workspaceId",
    zValidator("param", z.object({ workspaceId: z.string() })),
    zValidator("json", patchWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { workspaceId } = c.req.valid("param")
      const updates = c.req.valid("json")

      const user = c.get("user")

      const member = await getMember(workspaceId, user.id ?? "")

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            error: {
              message: "You do not have permission to perform this action.",
            },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      if (Object.keys(updates).length === 0) {
        return c.json(
          {
            success: false,
            error: {
              issues: [
                {
                  code: ZOD_ERROR_CODES.INVALID_UPDATES,
                  path: [],
                  message: ZOD_ERROR_MESSAGES.NO_UPDATES,
                },
              ],
              name: "ZodError",
            },
          },
          HttpStatusCodes.UNPROCESSABLE_ENTITY
        )
      }

      const [workspace] = await db
        .update(workspaces)
        .set(updates)
        .where(eq(workspaces.id, workspaceId))
        .returning()

      if (!workspace) {
        return c.json(
          {
            message: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.json(workspace, HttpStatusCodes.OK)
    }
  )
  .delete(
    "/:workspaceId",
    zValidator("param", z.object({ workspaceId: z.string() })),
    sessionMiddleware,
    async (c) => {
      const { workspaceId } = c.req.valid("param")

      const user = c.get("user")

      const member = await getMember(workspaceId, user.id ?? "")

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            data: null,
            error: {
              message: "You do not have permission to perform this action.",
            },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      // TODO: delete members, projects and tasks

      const result = await db
        .delete(workspaces)
        .where(eq(workspaces.id, workspaceId))

      // @ts-expect-error sada
      if (result.rowsAffected === 0) {
        return c.json(
          {
            success: false,
            data: null,
            error: {
              message: HttpStatusPhrases.NOT_FOUND,
            },
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.json(
        {
          success: true,
          data: { id: workspaceId },
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )
  .post(
    "/:workspaceId/reset-invite-code",
    zValidator("param", z.object({ workspaceId: z.string() })),
    sessionMiddleware,
    async (c) => {
      const { workspaceId } = c.req.valid("param")

      const user = c.get("user")

      const member = await getMember(workspaceId, user.id ?? "")

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            error: {
              message: "You do not have permission to perform this action.",
            },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      const [workspace] = await db
        .update(workspaces)
        .set({ inviteCode: generateInviteCode(10) })
        .where(eq(workspaces.id, workspaceId))
        .returning()

      if (!workspace) {
        return c.json(
          {
            message: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.json(workspace, HttpStatusCodes.OK)
    }
  )
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("param", z.object({ workspaceId: z.string() })),

    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.valid("param")

      const { code } = c.req.valid("json")

      const user = c.get("user")

      const member = await getMember(workspaceId, user.id ?? "")

      if (member) {
        return c.json(
          { error: "Already a member" },
          HttpStatusCodes.BAD_REQUEST
        )
      }

      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, workspaceId),
      })

      if (!workspace) {
        return c.json(
          { error: "Workspace does not exist." },
          HttpStatusCodes.NOT_FOUND
        )
      }

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid code." }, HttpStatusCodes.BAD_REQUEST)
      }

      await db
        .insert(members)
        .values({ workspaceId, userId: user.id ?? "", role: MemberRole.MEMBER })
        .returning()

      return c.json({ workspace })
    }
  )

export default app
