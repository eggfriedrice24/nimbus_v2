import * as React from "react"

import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/queries"
import { CreateWorkspaceCard } from "@/features/workspaces/components/create-workspace-form"
import { BriefcaseBusiness, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DottedSeparator } from "@/components/ui/separator"

export default async function GeneralSettings() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div>
        <Card className="w-full max-w-[500px] overflow-hidden shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">
                  Create Workspace
                </CardTitle>
                <CardDescription className="mt-2">
                  Enter a name for your new workspace and start collaborating!
                </CardDescription>
              </div>
              <BriefcaseBusiness className="size-8 text-white" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <CreateWorkspaceCard />
          </CardContent>
        </Card>

        <DottedSeparator className="my-12" />

        <Card className="sm:max-w-[500px]">
          <CardHeader className="items-center gap-4">
            <CardTitle>
              ⚠️☢️☣️🚫❌⛔💣🔥⚡Danger Zone💀🧨🔫🚧🏴📛☠️🚨🩸
            </CardTitle>

            <CardDescription className="text-center">
              Deleting this workspace is permanent and cannot be undone. All
              data related to it will be permanently removed from our servers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Delete <Trash className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
