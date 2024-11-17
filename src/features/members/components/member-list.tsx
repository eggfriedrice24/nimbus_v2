"use client"

import * as React from "react"

import { TailSpin } from "@/components/tailspin"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DottedSeparator } from "@/components/ui/separator"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { type MemberRole } from "@/server/db/schema/members"

import { useGetMembers } from "../services/use-get-members"
import { RemoveMemberAlert } from "./remove-member-alert"
import MemberRoleSelector from "./update-member-role-select"

export function MemberList() {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetMembers({ workspaceId })

  return (
    <Card className="border-none bg-secondary/50">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Manage your team, assign roles and remove members as needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {isLoading && <TailSpin className="mx-auto" />}

        {!isLoading &&
          data?.data?.map((m, i) => (
            <React.Fragment key={m.id}>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={m.user.image ?? "/avatars/01.png"} />
                    <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {m.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {m.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MemberRoleSelector
                    initialRole={m.role as MemberRole}
                    memberId={m.id}
                  />

                  <RemoveMemberAlert memberId={m.id} />
                </div>
              </div>

              {i !== data.data.length - 1 && <DottedSeparator />}
            </React.Fragment>
          ))}
      </CardContent>
    </Card>
  )
}
