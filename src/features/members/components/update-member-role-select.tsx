"use client"

import * as React from "react"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MemberRole } from "@/server/db/schema/members"

import { useUpdateMember } from "../services/use-update-member"

export default function MemberRoleSelector({
  initialRole,
  memberId,
}: {
  initialRole: MemberRole
  memberId: string
}) {
  const { mutate } = useUpdateMember()

  const handleRoleUpdate = (newRole: MemberRole) => {
    mutate({
      param: { memberId },
      json: { role: newRole },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-auto" size="icon" aria-label="Change member role">
          <DotsHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Member Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={initialRole}
          onValueChange={(value) => handleRoleUpdate(value as MemberRole)}
        >
          <DropdownMenuRadioItem value={MemberRole.ADMIN}>
            Admin
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={MemberRole.MEMBER}>
            Member
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
