import { relations, sql } from "drizzle-orm"
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { users } from "./user"
import { workspaces } from "./workspaces"

export const members = pgTable("workspace", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  workspaceId: varchar("workspace_id", { length: 255 })
    .notNull()
    .references(() => workspaces.id),
  role: varchar("workspace_id", {
    length: 30,
    enum: ["ADMIN", "MEMBER"],
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const memberRelations = relations(workspaces, ({ one }) => ({
  user: one(users, { fields: [members.userId], references: [users.id] }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}))

// Type Exports

// Select
export type Member = typeof members.$inferSelect
export const selectMemberSchema = createSelectSchema(members)

// Insert
export type NewMember = typeof members.$inferInsert
export const insertMemberSchema = createInsertSchema(members)
  .required({
    userId: true,
    workspaceId: true,
    role: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })

// Patch
export const patchMemberSchema = insertMemberSchema.partial()
