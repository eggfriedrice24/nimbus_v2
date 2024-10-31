import { db } from "@/server/db"
import { insertTasksSchema, patchTasksSchema, tasks } from "@/server/db/schema"
import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"
import * as HttpStatusPhrases from "stoker/http-status-phrases"
import { z } from "zod"

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants"

const taskRoutes = new Hono()
  .get("/tasks", async (c) => {
    const tasks = await db.query.tasks.findMany()

    return c.json(tasks)
  })
  .get(
    "/tasks/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param")

      const task = await db.query.tasks.findFirst({
        where: (tasks, { eq }) => eq(tasks.id, id.toString()),
      })

      if (!task) {
        return c.json(
          {
            message: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.json(task, HttpStatusCodes.OK)
    }
  )
  .post("/tasks", zValidator("json", insertTasksSchema), async (c) => {
    const task = c.req.valid("json")
    const [inserted] = await db.insert(tasks).values(task).returning()
    return c.json(inserted, HttpStatusCodes.OK)
  })
  .patch(
    "/tasks",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator("json", patchTasksSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const updates = c.req.valid("json")

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

      const [task] = await db
        .update(tasks)
        .set(updates)
        .where(eq(tasks.id, id))
        .returning()

      if (!task) {
        return c.json(
          {
            message: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.json(task, HttpStatusCodes.OK)
    }
  )
  .delete(
    "/tasks",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param")
      const result = await db.delete(tasks).where(eq(tasks.id, id))

      // @ts-expect-error sadsa
      if (result.rowsAffected === 0) {
        return c.json(
          {
            message: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.body(null, HttpStatusCodes.NO_CONTENT)
    }
  )

export default taskRoutes
