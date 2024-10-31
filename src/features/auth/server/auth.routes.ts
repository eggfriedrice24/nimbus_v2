import { db } from "@/server/db"
import { users } from "@/server/db/schema/user"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { loginSchema, registerSchema } from "../schemas/validations"

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), (c) => {
    const { email, password } = c.req.valid("json")

    console.log({ email, password })

    return c.json({ success: "ok" })
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const data = c.req.valid("json")

    if (!data) {
      throw new Error("Not valid data!")
    }

    const user = await db
      .insert(users)
      .values({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      .returning({ user: users.id })

    return c.json({ data: user })
  })

export default app
