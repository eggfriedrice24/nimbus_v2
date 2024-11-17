import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"
import { z } from "zod"

import { getMember } from "@/features/members/lib/queries"
import { db } from "@/server/db"
import { projects } from "@/server/db/schema"
import { sessionMiddleware } from "@/server/session-middleware"

const app = new Hono().get(
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
      orderBy: (projects, { asc }) => [asc(projects.createdAt)],
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

export default app
