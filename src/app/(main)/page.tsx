import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/queries"
import { getWorkspaces } from "@/features/workspaces/queries"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  const workspaces = await getWorkspaces()

  if (workspaces.length === 0) {
    redirect("/workspaces/create")
  } else {
    redirect(`/workspaces/${workspaces[0]?.id}`)
  }
}
