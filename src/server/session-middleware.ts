import "server-only"

import { deleteCookie, getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { verify } from "hono/jwt"
import * as HttpStatusCodes from "stoker/http-status-codes"

import { env } from "@/env"

import { type User } from "./db/schema/user"

const tokenBlacklist = new Set<string>()

type AdditionalContext = {
  Variables: {
    user: Partial<User>
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const token = getCookie(c, env.NIMBUS_AUTH_COOKIE)

    if (!token) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED)
    }

    try {
      const payload = await verify(token, env.JWT_SECRET)

      if (tokenBlacklist.has(token)) {
        deleteCookie(c, env.NIMBUS_AUTH_COOKIE)
        return c.json(
          { error: "Token is expired" },
          HttpStatusCodes.UNAUTHORIZED
        )
      }

      c.set("user", payload as Partial<User>)

      await next()
    } catch {
      deleteCookie(c, env.NIMBUS_AUTH_COOKIE)
      return c.json(
        { error: "Invalid or expired token" },
        HttpStatusCodes.UNAUTHORIZED
      )
    }
  }
)

export const invalidateToken = (token: string) => {
  tokenBlacklist.add(token)
}

export const isTokenBlacklisted = (token: string) => {
  return tokenBlacklist.has(token)
}
