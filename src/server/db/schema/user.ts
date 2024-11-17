import { relations, sql } from "drizzle-orm"
import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { members } from "./members"
import { projects } from "./projects"
import { workspaces } from "./workspaces"

export const userRoles = pgEnum(`user_roles`, ["admin", "user"])

export const users = pgTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  role: userRoles("user_roles").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  workspaces: many(workspaces),
  members: many(members),
  projects: many(projects),
}))

export const accounts = pgTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type").notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

// Type Exports

// Select
export type User = typeof users.$inferSelect
export const selectUsersSchema = createSelectSchema(users)

// Insert
export type NewUser = typeof users.$inferInsert
export const insertUsersSchema = createInsertSchema(users, {
  name: (schema) => schema.name.min(1).max(500),
})
  .required({
    role: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })

// Patch
export const patchUsersSchema = insertUsersSchema.partial()

// Enum
export type UserRole = (typeof userRoles.enumValues)[number]
