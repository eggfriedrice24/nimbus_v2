import { zValidator } from "@hono/zod-validator"
import bcrypt from "bcryptjs"
import { Hono } from "hono"
import { deleteCookie, setCookie } from "hono/cookie"
import { sign } from "hono/jwt"
import * as HttpStatusCodes from "stoker/http-status-codes"

import { db } from "@/server/db"
import { users } from "@/server/db/schema/user"
import { sessionMiddleware } from "@/server/session-middleware"

import { getUserByEmail } from "../lib/queries"
import { loginSchema, registerSchema } from "../lib/validations"

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user")

    return c.json({ session: user }, HttpStatusCodes.OK)
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json")

    const existingUser = await getUserByEmail(email)

    if (!existingUser?.[0]) {
      return c.json({ error: "User not found" }, HttpStatusCodes.UNAUTHORIZED)
    }

    const user = existingUser[0]

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return c.json({ error: "Invalid password" }, HttpStatusCodes.UNAUTHORIZED)
    }

    const jwtPayoload = {
      id: user.id,
      role: user.role,
      name: user.name,
    }

    const secret = "mysecret"
    const token = await sign(jwtPayoload, secret)

    setCookie(c, "nimbus-auth-cookie", token, {
      expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      secure: true,
      sameSite: "Strict",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return c.json({ data: { token } })
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { email, name, password } = c.req.valid("json")

    const existingUser = await getUserByEmail(email)

    if (existingUser[0]) {
      return c.json(
        { error: "Email already registered" },
        HttpStatusCodes.CONFLICT
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    const [inserted] = await db
      .insert(users)
      .values({ email, password: hashed, name })
      .returning()

    return c.json(inserted, HttpStatusCodes.CREATED)
  })
  .post("/logout", sessionMiddleware, (c) => {
    deleteCookie(c, "nimbus-auth-cookie")

    return c.json({ success: true })
  })

export default app
