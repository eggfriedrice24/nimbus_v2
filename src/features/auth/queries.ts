import { cookies } from "next/headers"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { type User } from "@/server/db/schema/user"
import { eq } from "drizzle-orm"
import { decode } from "hono/jwt"

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
  const session = cookies().get("nimbus-auth-cookie")

  if (!session) {
    return null
  }

  const user = decode(session.value).payload as User

  return user
}
