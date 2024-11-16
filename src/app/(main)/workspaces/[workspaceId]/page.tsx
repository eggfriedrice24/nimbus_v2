import { redirect } from "next/navigation"
import { getServerSession } from "@/features/auth/lib/queries"

import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function Page() {
  const session = await getServerSession()

  if (!session) redirect("/sign-in")

  return (
    <div>
      <SidebarTrigger />
    </div>
  )
}
