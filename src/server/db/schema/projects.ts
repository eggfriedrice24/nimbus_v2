import { relations, sql } from "drizzle-orm"
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { workspaces } from "./workspaces"

export const projects = pgTable("project", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: varchar("workspace_id", { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  emoji: varchar("emoji", {
    length: 20,
  }),
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
}))

// Type Exports

// Select
export type Project = typeof projects.$inferSelect
export const selectProjectschema = createSelectSchema(projects)

// Insert
export type NewProject = typeof projects.$inferInsert
export const insertProjectschema = createInsertSchema(projects)
  .required({
    workspaceId: true,
    name: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })

// Patch
export const patchProjectschema = insertProjectschema.partial()
