import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
  password: z.string().min(1, {
    message: "Password is required!",
  }),
})

export const registerSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
  password: z.string().min(6, {
    message: "Password is required!",
  }),
  name: z.string().min(1, {
    message: "Name is required!",
  }),
})

export type RegisterSchemaType = z.infer<typeof registerSchema>
