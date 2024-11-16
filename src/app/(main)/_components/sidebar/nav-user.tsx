import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut } from "lucide-react"

import { ThemeSwitcher } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useLogout } from "@/features/auth/services/use-logout"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { mutate } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg group-hover:bg-sidebar">
              TT
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
              <Avatar className="size-7 rounded-md">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <div className="grid flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="overflow-hidden text-xs text-muted-foreground">
                  <div className="line-clamp-1">{user.email}</div>
                </div>
              </div>
            </div>

            <ThemeSwitcher />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2">
            <BadgeCheck className="size-4 text-muted-foreground" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2" onClick={() => mutate()}>
          <LogOut className="size-4 text-muted-foreground" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
