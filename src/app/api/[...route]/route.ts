import taskRoutes from "@/features/tasks/routes/tasks.routes"
import { Hono } from "hono"
import { handle } from "hono/vercel"

const app = new Hono().basePath("/api")

const routes = app.route("/", taskRoutes)

export const GET = handle(app)

export type AppType = typeof routes
