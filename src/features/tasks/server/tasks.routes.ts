import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { customAlphabet } from "nanoid"
import * as HttpStatusCodes from "stoker/http-status-codes"
import * as HttpStatusPhrases from "stoker/http-status-phrases"
import { z } from "zod"

import { getMember } from "@/features/members/lib/queries"
import { db } from "@/server/db"
import {
  insertTasksSchema,
  patchTasksSchema,
  selectTasksSchema,
  tasks,
} from "@/server/db/schema/tasks"
import { sessionMiddleware } from "@/server/session-middleware"

const app = new Hono()
  .delete(
    "/:taskId",
    zValidator("param", z.object({ taskId: z.string() })),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user")

      const { taskId } = c.req.valid("param")

      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
      })

      if (!task) {
        return c.json(
          {
            success: true,
            data: null,
            error: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.OK
        )
      }

      const member = await getMember(task.workspaceId, user.id ?? "")
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

      await db.delete(tasks).where(eq(tasks.id, task.id))

      return c.json(
        {
          success: true,
          data: { id: task.id },
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )
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

      const code = `TASK-${customAlphabet("0123456789", 4)()}`

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
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator(
      "param",
      z.object({
        taskId: z.string(),
      })
    ),
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string(),
      })
    ),
    zValidator("json", patchTasksSchema),
    async (c) => {
      const user = c.get("user")

      const { taskId } = c.req.valid("param")
      const { workspaceId, projectId } = c.req.valid("query")
      const updates = c.req.valid("json")

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

      const task = await db.query.tasks.findFirst({
        where: (tasks, { and, eq }) =>
          and(
            eq(tasks.id, taskId),
            eq(tasks.workspaceId, workspaceId),
            eq(tasks.projectId, projectId)
          ),
      })

      if (!task) {
        return c.json(
          {
            success: false,
            data: null,
            error: {
              message:
                "Task not found or does not belong to this workspace/project.",
            },
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      const [updatedTask] = await db
        .update(tasks)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId))
        .returning()

      return c.json(
        {
          success: true,
          data: updatedTask,
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )
  .post(
    "/batch-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        updates: z.array(
          z.object({
            id: z.string(),
            status: z.enum([
              "backlog",
              "todo",
              "in-progress",
              "in-review",
              "done",
              "canceled",
            ]),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const user = c.get("user")

      const { updates } = c.req.valid("json")

      const taskIds = updates.map((update) => update.id)

      const existingTasks = await db.query.tasks.findMany({
        where: (tasks, { and, inArray }) => and(inArray(tasks.id, taskIds)),
        with: { workspace: true },
      })

      const workspaceIds = new Set(existingTasks.map((i) => i.workspace.id))

      if (workspaceIds.size !== 1) {
        return c.json(
          {
            success: false,
            data: null,
            error: {
              message: "One or more tasks not found or not in this workspace.",
            },
          },
          HttpStatusCodes.BAD_REQUEST
        )
      }

      const workspaceId = workspaceIds.values().next().value

      const member = await getMember(workspaceId ?? "", user.id ?? "")
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

      const updatedTasks = await db.transaction(async (tx) => {
        const results = []
        for (const update of updates) {
          const updatedTask = await tx
            .update(tasks)
            .set({
              status: update.status,
              position: update.position,
            })
            .where(eq(tasks.id, update.id))
            .returning()

          results.push(updatedTask)
        }
        return results
      })

      return c.json(
        {
          success: true,
          data: updatedTasks.flat(),
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )

export default app
