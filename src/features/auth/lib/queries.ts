import "server-only"

import { cookies } from "next/headers"

import { eq } from "drizzle-orm"
import { decode } from "hono/jwt"

import { env } from "@/env"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { type User } from "@/server/db/schema/user"

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email))

    return user
  } catch {
    return []
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id))

    return user
  } catch {
    return []
  }
}

export const getServerSession = async () => {
  const session = cookies().get(env.NIMBUS_AUTH_COOKIE)

  if (!session) {
    return null
  }

  const user = decode(session.value).payload as User

  return user
}
