"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { type NavItem } from "./sidebar-data"
import { SidebarSearch } from "./sidebar-search"

export function NavMain({
  items,
  searchResults,
}: {
  items: NavItem[]
  searchResults: React.ComponentProps<typeof SidebarSearch>["results"]
} & React.ComponentProps<"ul">) {
  const pathname = usePathname()

  const isActiveRoute = (url?: string, exact = false) => {
    if (exact) {
      return pathname === url
    } else {
      return pathname === url || pathname.startsWith(url ?? "")
    }
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarSearch results={searchResults} />
      </SidebarMenuItem>

      {items.map((item) =>
        item.items?.length ? (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={
              item.isActive ??
              item.items.some((subItem) => isActiveRoute(subItem.url))
            }
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActiveRoute(subItem.url, true)}
                      >
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActiveRoute(item.url, true)}
              asChild
            >
              <Link href={item.url ?? "#"}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      )}
    </>
  )
}
