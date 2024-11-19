import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"
import * as HttpStatusPhrases from "stoker/http-status-phrases"
import { z } from "zod"

import { getMember } from "@/features/members/lib/queries"
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants"
import { db } from "@/server/db"
import { projects } from "@/server/db/schema"
import { MemberRole } from "@/server/db/schema/members"
import {
  insertProjectschema,
  patchProjectschema,
} from "@/server/db/schema/projects"
import { sessionMiddleware } from "@/server/session-middleware"

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user")
      const { workspaceId } = c.req.valid("query")

      const member = await getMember(workspaceId, user.id ?? "")

      if (!member) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Unauthorized." },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      const projectList = await db.query.projects.findMany({
        where: eq(projects.workspaceId, workspaceId),
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
      })

      return c.json(
        {
          success: true,
          data: projectList,
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", insertProjectschema),
    async (c) => {
      const { name, emoji, workspaceId } = c.req.valid("json")
      const user = c.get("user")

      const member = await getMember(workspaceId, user.id ?? "")

      if (!member) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Unauthorized." },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      const [insertedProject] = await db
        .insert(projects)
        .values({ name, emoji, workspaceId, userId: user.id ?? "" })
        .returning()

      return c.json(
        {
          success: true,
          data: insertedProject,
          error: null,
        },
        HttpStatusCodes.CREATED
      )
    }
  )
  .patch(
    "/:workspaceId",
    zValidator(
      "param",
      z.object({ projectId: z.string(), workspaceId: z.string() })
    ),
    zValidator("json", patchProjectschema),
    sessionMiddleware,
    async (c) => {
      const { workspaceId, projectId } = c.req.valid("param")
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

      const [project] = await db
        .update(projects)
        .set(updates)
        .where(eq(projects.id, projectId))
        .returning()

      if (!project) {
        return c.json(
          {
            message: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.json(project, HttpStatusCodes.OK)
    }
  )
  .delete(
    "/:workspaceId",
    zValidator(
      "param",
      z.object({ workspaceId: z.string(), projectId: z.string() })
    ),
    sessionMiddleware,
    async (c) => {
      const { workspaceId, projectId } = c.req.valid("param")

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

      // TODO: delete tasks related to project
      const result = await db.delete(projects).where(eq(projects.id, projectId))

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
          data: { id: projectId },
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )

export default app
