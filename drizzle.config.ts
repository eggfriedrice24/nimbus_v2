import { env } from "@/env"
import { type Config } from "drizzle-kit"

export default {
  schema: "./src/server/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["next-hono-starter_*"],
} satisfies Config
