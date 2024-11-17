import * as React from "react"

import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getServerSession } from "@/features/auth/lib/queries"
import { MemberList } from "@/features/members/components/member-list"

export default async function Members({
  params,
}: {
  params: { workspaceId: string }
}) {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div className="container mx-auto max-w-2xl flex-1">
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="secondary">
          <Link href={`/workspaces/${params.workspaceId}`}>
            <ChevronLeft className="mr-2 size-4" />
            Back to Workspace
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Manage Members</h1>
      </div>
      <div className="space-y-4">
        <MemberList />
      </div>
    </div>
  )
}
