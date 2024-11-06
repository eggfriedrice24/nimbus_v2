import { cookies } from "next/headers"
import { type User } from "@/server/db/schema/user"
import { decode } from "hono/jwt"

export const getServerSession = async () => {
  const session = cookies().get("nimbus-auth-cookie")

  if (!session) {
    return null
  }

  const user = decode(session.value).payload as User

  return user
}
