import * as React from "react"

import { redirect } from "next/navigation"
import { BriefcaseBusiness } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getServerSession } from "@/features/auth/lib/queries"
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form"

export default async function CreateWorkspacePage() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-md overflow-hidden shadow">
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
        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  )
}
