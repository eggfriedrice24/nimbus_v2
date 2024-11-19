import { zValidator } from "@hono/zod-validator"
import { eq, like } from "drizzle-orm"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"
import { z } from "zod"

import { getMember } from "@/features/members/lib/queries"
import { db } from "@/server/db"
import { insertTasksSchema, tasks } from "@/server/db/schema/tasks"
import { sessionMiddleware } from "@/server/session-middleware"

import { generateId } from "../lib/utils"

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        label: z
          .enum(["bug", "feature", "enhancement", "documentation"])
          .nullish(),
        status: z
          .enum([
            "backlog",
            "todo",
            "in-progress",
            "in-review",
            "done",
            "canceled",
          ])
          .nullish(),
        priority: z.enum(["low", "medium", "high"]).nullish(),
        search: z.string().nullish(),
        dueDate: z.date().nullish(),
      })
    ),
    async (c) => {
      const user = c.get("user")

      const {
        workspaceId,
        projectId,
        assigneeId,
        status,
        priority,
        search,
        dueDate,
      } = c.req.valid("query")

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

      const query = [eq(tasks.workspaceId, workspaceId)]

      if (projectId) {
        query.push(eq(tasks.projectId, projectId))
      }
      if (assigneeId) {
        query.push(eq(tasks.assigneeId, assigneeId))
      }
      if (status) {
        query.push(eq(tasks.status, status))
      }
      if (priority) {
        query.push(eq(tasks.priority, priority))
      }
      if (dueDate) {
        query.push(eq(tasks.dueDate, dueDate))
      }

      if (search) {
        query.push(like(tasks.title, `%${search}%`))
      }

      const tasksData = await db.query.tasks.findMany({
        where: (_, { and }) => and(...query),
        with: {
          owner: true,
          assignee: true,
          project: true,
          workspace: true,
        },
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      })

      return c.json(
        {
          success: true,
          data: tasksData,
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", insertTasksSchema),
    async (c) => {
      const user = c.get("user")

      const input = c.req.valid("json")

      const member = await getMember(input.workspaceId, user.id ?? "")

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

      const highestPositionTask = await db.query.tasks.findFirst({
        where: (tasks, { and, eq }) =>
          and(
            eq(tasks.status, input.status ?? "todo"),
            eq(tasks.workspaceId, input.workspaceId)
          ),
        orderBy: (tasks, { asc }) => [asc(tasks.position)],
      })

      const newPosition = highestPositionTask
        ? highestPositionTask.position + 1000
        : 1000

      const code = generateId()

      const newTask = await db.insert(tasks).values({
        ...input,
        position: newPosition,
        code,
        ownerId: user.id ?? "",
      })

      return c.json(
        {
          success: true,
          data: newTask,
          error: null,
        },
        HttpStatusCodes.CREATED
      )
    }
  )

export default app
