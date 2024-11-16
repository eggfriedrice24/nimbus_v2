import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import * as HttpStatusCodes from "stoker/http-status-codes"
import { z } from "zod"

import { db } from "@/server/db"
import { members } from "@/server/db/schema"
import { MemberRole } from "@/server/db/schema/members"
import { sessionMiddleware } from "@/server/session-middleware"

import { getMember } from "../lib/queries"

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user")
      const { workspaceId } = c.req.valid("query")
      const member = await getMember(workspaceId, user.id ?? "")

      if (!member) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Unauthorized." },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      const memberList = await db.query.members.findMany({
        with: { user: true, workspace: true },
        where: eq(members.workspaceId, workspaceId),
      })

      return c.json(
        {
          success: true,
          data: memberList,
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )
  .delete(
    "/:memberId",
    sessionMiddleware,
    zValidator("param", z.object({ memberId: z.string() })),
    async (c) => {
      const user = c.get("user")
      const { memberId } = c.req.valid("param")

      const memberToDelete = await db.query.members.findFirst({
        where: eq(members.id, memberId),
      })

      if (!memberToDelete) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Member not found." },
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      const allMembers = await db.query.members.findMany({
        where: eq(members.workspaceId, memberToDelete.workspaceId),
      })

      const currentMember = await getMember(
        memberToDelete.workspaceId,
        user.id ?? ""
      )

      if (
        !currentMember ||
        (currentMember.id !== memberToDelete.id &&
          currentMember.role !== MemberRole.ADMIN)
      ) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Unauthorized." },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      if (allMembers.length === 1) {
        return c.json(
          {
            success: false,
            data: null,
            error: {
              message:
                "Cannot delete. There is only one member in this workspace.",
            },
          },
          HttpStatusCodes.BAD_REQUEST
        )
      }

      const result = await db
        .delete(members)
        .where(eq(members.id, memberToDelete.id))

      // @ts-expect-error sada
      if (result.rowsAffected === 0) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Not Found." },
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      return c.json(
        {
          success: true,
          data: { id: memberToDelete.id },
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("param", z.object({ memberId: z.string() })),
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const user = c.get("user")
      const { memberId } = c.req.valid("param")
      const { role } = c.req.valid("json")

      const memberToUpdate = await db.query.members.findFirst({
        where: eq(members.id, memberId),
      })

      if (!memberToUpdate) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Member not found." },
          },
          HttpStatusCodes.NOT_FOUND
        )
      }

      const currentMember = await getMember(
        memberToUpdate.workspaceId,
        user.id ?? ""
      )

      if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Unauthorized." },
          },
          HttpStatusCodes.FORBIDDEN
        )
      }

      const allMembers = await db.query.members.findMany({
        where: eq(members.workspaceId, memberToUpdate.workspaceId),
      })

      if (allMembers.length === 1 && role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            data: null,
            error: {
              message:
                "Cannot downgrade role. Only one member exists in the workspace.",
            },
          },
          HttpStatusCodes.BAD_REQUEST
        )
      }

      const result = await db
        .update(members)
        .set({ role })
        .where(eq(members.id, memberId))

      // @ts-expect-error sada
      if (result.rowsAffected === 0) {
        return c.json(
          {
            success: false,
            data: null,
            error: { message: "Update failed." },
          },
          HttpStatusCodes.INTERNAL_SERVER_ERROR
        )
      }

      return c.json(
        {
          success: true,
          data: { id: memberToUpdate.id, role },
          error: null,
        },
        HttpStatusCodes.OK
      )
    }
  )

export default app
