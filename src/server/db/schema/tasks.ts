import { relations, sql } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { projects } from "./projects"
import { users } from "./user"
import { workspaces } from "./workspaces"

export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 255 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  code: varchar("code", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 128 }).notNull(),
  description: text("description"),
  status: varchar("status", {
    length: 30,
    enum: ["backlog", "todo", "in-progress", "in-review", "done", "canceled"],
  })
    .notNull()
    .default("todo"),
  label: varchar("label", {
    length: 30,
    enum: ["bug", "feature", "enhancement", "documentation"],
  })
    .notNull()
    .default("bug"),
  priority: varchar("priority", {
    length: 30,
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("low"),
  archived: boolean("archived").notNull().default(false),
  dueDate: timestamp("due_date").notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),

  workspaceId: varchar("workspace_id", { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: varchar("project_id", { length: 255 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  assigneeId: varchar("assignee_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ownerId: varchar("owner_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export const taskRelations = relations(tasks, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  owner: one(users, {
    fields: [tasks.ownerId],
    references: [users.id],
  }),
}))

export type Task = typeof tasks.$inferSelect
export const selectTasksSchema = createSelectSchema(tasks)

export type NewTask = typeof tasks.$inferInsert
export const insertTasksSchema = createInsertSchema(tasks, {
  title: (schema) => schema.title.min(1).max(500),
  position: (schema) => schema.position.min(1000).max(1000000),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  code: true,
  position: true,
  ownerId: true,
  workspaceId: true,
  projectId: true,
})

export const patchTasksSchema = insertTasksSchema.partial()
