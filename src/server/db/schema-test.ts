import { sql } from "drizzle-orm"
import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 255 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  code: varchar("code", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 128 }),
  status: varchar("status", {
    length: 30,
    enum: ["todo", "in-progress", "done", "canceled"],
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const selectTasksSchema = createSelectSchema(tasks)

export const insertTasksSchema = createInsertSchema(tasks, {
  title: (schema) => schema.title.min(1).max(500),
})
  .required({
    status: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })

export const patchTasksSchema = insertTasksSchema.partial()
