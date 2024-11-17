"use client"

import * as React from "react"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DottedSeparator } from "@/components/ui/separator"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import { useGetMembers } from "../services/use-get-members"
import { RemoveMemberAlert } from "./remove-member-alert"

export function MemberList() {
  const workspaceId = useWorkspaceId()
  const { data } = useGetMembers({ workspaceId })

  return (
    <Card className="border-none bg-secondary/50">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {data?.data?.map((m, i) => (
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="ml-auto" size="icon">
                      <DotsHorizontalIcon className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Select new role..." />
                      <CommandList>
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem className="flex flex-col items-start px-4 py-2">
                            <p>Viewer</p>
                            <p className="text-sm text-muted-foreground">
                              Can view and comment.
                            </p>
                          </CommandItem>
                          <CommandItem className="flex flex-col items-start px-4 py-2">
                            <p>Developer</p>
                            <p className="text-sm text-muted-foreground">
                              Can view, comment and edit.
                            </p>
                          </CommandItem>
                          <CommandItem className="flex flex-col items-start px-4 py-2">
                            <p>Billing</p>
                            <p className="text-sm text-muted-foreground">
                              Can view, comment and manage billing.
                            </p>
                          </CommandItem>
                          <CommandItem className="flex flex-col items-start px-4 py-2">
                            <p>Owner</p>
                            <p className="text-sm text-muted-foreground">
                              Admin-level access to all resources.
                            </p>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

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
