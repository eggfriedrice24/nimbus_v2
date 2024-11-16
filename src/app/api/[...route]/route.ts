import { Hono } from "hono"
import { handle } from "hono/vercel"
import { notFound, onError } from "stoker/middlewares"

import authRoutes from "@/features/auth/server/auth.routes"
import memberRoutes from "@/features/members/server/member.routes"
import workspaceRoutes from "@/features/workspaces/server/workspaces.routes"

const app = new Hono().basePath("/api")

app.notFound(notFound)
app.onError(onError)

const routes = app
  .route("/auth", authRoutes)
  .route("/workspaces", workspaceRoutes)
  .route("/members", memberRoutes)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
