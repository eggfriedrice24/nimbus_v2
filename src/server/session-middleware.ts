import "server-only"

import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { decode } from "hono/jwt"
import * as HttpStatusCodes from "stoker/http-status-codes"

import { type User } from "./db/schema/user"

type AdditionalContext = {
  Variables: {
    user: Partial<User>
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = getCookie(c, "nimbus-auth-cookie")

    if (!session) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED)
    }

    const user = decode(session).payload as User

    c.set("user", user)

    await next()
  }
)
