import { db } from "@/server/db"
import { workspaces } from "@/server/db/schema"
import { sessionMiddleware } from "@/server/session-middleware"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"

import { createWorkspaceSchema } from "../schemas/validations"

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const { name } = c.req.valid("json")

    const user = c.get("user")

    if (!user?.id)
      return c.json({ error: "Auth required!" }, HttpStatusCodes.UNAUTHORIZED)

    const [inserted] = await db
      .insert(workspaces)
      .values({ name, userId: user.id })
      .returning()

    return c.json(inserted, HttpStatusCodes.OK)
  }
)

export default app
