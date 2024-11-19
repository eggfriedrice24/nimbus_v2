import { eq, like } from "drizzle-orm"
import { z } from "zod"

import { getServerSession } from "@/features/auth/lib/queries"
import { getMember } from "@/features/members/lib/queries"
import { db } from "@/server/db"
import { tasks } from "@/server/db/schema/tasks"

const getTasksSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  label: z.enum(["bug", "feature", "enhancement", "documentation"]).nullish(),
  status: z
    .enum(["backlog", "todo", "in-progress", "in-review", "done", "canceled"])
    .nullish(),
  priority: z.enum(["low", "medium", "high"]).nullish(),
  search: z.string().nullish(),
  dueDate: z.coerce.date().nullish(),
})

export async function getTasks(input: z.infer<typeof getTasksSchema>) {
  const user = await getServerSession()

  if (!user) {
    return {
      success: false,
      data: null,
      error: { message: "Unauthorized." },
    }
  }

  const {
    workspaceId,
    projectId,
    assigneeId,
    status,
    priority,
    search,
    dueDate,
  } = getTasksSchema.parse(input)

  const member = await getMember(workspaceId, user?.id ?? "")

  if (!member) {
    return {
      success: false,
      data: null,
      error: { message: "Unauthorized." },
    }
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

  return {
    success: true,
    data: tasksData,
    error: null,
  }
}
