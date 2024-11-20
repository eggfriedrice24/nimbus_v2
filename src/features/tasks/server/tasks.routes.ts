import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"
import { z } from "zod"

import { getMember } from "@/features/members/lib/queries"
import { db } from "@/server/db"
import {
  insertTasksSchema,
  selectTasksSchema,
  tasks,
} from "@/server/db/schema/tasks"
import { sessionMiddleware } from "@/server/session-middleware"

import { generateId } from "../lib/utils"

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", selectTasksSchema),
    async (c) => {
      const user = c.get("user")

      const {
        workspaceId,
        projectId,
        assigneeId,
        status,
        label,
        priority,
        title,
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

      if (title) {
        query.push(eq(tasks.title, title))
      }
      if (label) {
        query.push(eq(tasks.label, label))
      }

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
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string(),
      })
    ),
    zValidator("json", insertTasksSchema),
    async (c) => {
      const user = c.get("user")

      const input = c.req.valid("json")
      const { workspaceId, projectId } = c.req.valid("query")

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

      const highestPositionTask = await db.query.tasks.findFirst({
        where: (tasks, { and, eq }) =>
          and(
            eq(tasks.status, input.status ?? "todo"),
            eq(tasks.workspaceId, workspaceId)
          ),
        orderBy: (tasks, { asc }) => [asc(tasks.position)],
      })

      const newPosition = highestPositionTask
        ? highestPositionTask.position + 1000
        : 1000

      const code = generateId()

      const newTask = await db
        .insert(tasks)
        .values({
          ...input,
          workspaceId,
          projectId,
          position: newPosition,
          code,
          ownerId: user.id ?? "",
        })
        .returning()

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
