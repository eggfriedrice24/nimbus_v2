import { redirect } from "next/navigation"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { getServerSession } from "@/features/auth/lib/queries"

export default async function Page() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div>
      <SidebarTrigger />
    </div>
  )
}
