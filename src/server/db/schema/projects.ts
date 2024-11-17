import { relations, sql } from "drizzle-orm"
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { users } from "./user"
import { workspaces } from "./workspaces"

export const projects = pgTable("project", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  workspaceId: varchar("workspace_id", { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  emoji: varchar("emoji", {
    length: 20,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const projectRelations = relations(projects, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, { fields: [projects.userId], references: [users.id] }),
}))

// Type Exports

// Select
export type Project = typeof projects.$inferSelect
export const selectProjectschema = createSelectSchema(projects)

// Insert
export type NewProject = typeof projects.$inferInsert
export const insertProjectschema = createInsertSchema(projects)
  .required({
    name: true,
    workspaceId: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  })

// Patch
export const patchProjectschema = insertProjectschema.partial()
