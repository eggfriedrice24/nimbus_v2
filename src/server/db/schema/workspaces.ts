import { relations, sql } from "drizzle-orm"
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { users } from "./user"

export const workspaces = pgTable("workspace", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const workspacesRelations = relations(workspaces, ({ one }) => ({
  user: one(users, { fields: [workspaces.userId], references: [users.id] }),
}))

// Type Exports

// Select
export type Workspace = typeof workspaces.$inferSelect
export const selectWorkspacesSchema = createSelectSchema(workspaces)

// Insert
export type NewWorkspace = typeof workspaces.$inferInsert
export const insertWorkspaceSchema = createInsertSchema(workspaces, {
  name: (schema) => schema.name.min(1).max(500),
})
  .required({
    userId: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })

// Patch
export const patchWorkspaceSchema = insertWorkspaceSchema.partial()
