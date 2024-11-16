import authRoutes from "@/features/auth/server/auth.routes"
import workspaceRoutes from "@/features/workspaces/server/workspaces.routes"
import { Hono } from "hono"
import { handle } from "hono/vercel"
import { notFound, onError } from "stoker/middlewares"

const app = new Hono().basePath("/api")

app.notFound(notFound)
app.onError(onError)

const routes = app
  .route("/auth", authRoutes)
  .route("/workspaces", workspaceRoutes)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
