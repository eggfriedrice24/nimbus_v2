import * as z from "zod"

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required!",
  }),
})

export type CreateWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>
