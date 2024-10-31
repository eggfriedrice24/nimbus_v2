import authRoutes from "@/features/auth/server/auth.routes"
import { Hono } from "hono"
import { handle } from "hono/vercel"

const app = new Hono().basePath("/api")

const routes = app.route("/auth", authRoutes)

export const GET = handle(app)

export type AppType = typeof routes
