import Link from "next/link"

import { Search } from "lucide-react"

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function SidebarSearch({
  results,
}: {
  results: {
    title: string
    teaser: string
    url: string
  }[]
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Search className="size-4 shrink-0" />
            <div className="flex flex-1 overflow-hidden">
              <p className="line-clamp-1 pr-6">Search</p>
            </div>
          </SidebarMenuButton>
        </DrawerTrigger>
        <DrawerContent>
          <form>
            <div className="border-b p-2.5">
              <Input
                type="search"
                placeholder="Search..."
                className="h-8 rounded-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </form>
          <div className="grid gap-1 p-1.5 text-sm">
            {results.map((result) => (
              <Link
                href={result.url}
                key={result.title}
                className="rounded-md p-2.5 outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
              >
                <div className="font-medium">{result.title}</div>
                <div className="line-clamp-2 text-muted-foreground">
                  {result.teaser}
                </div>
              </Link>
            ))}
            <Separator className="my-1.5" />
            <Link
              href="#"
              className="rounded-md px-2.5 py-1 text-muted-foreground outline-none ring-ring hover:text-foreground focus-visible:ring-2"
            >
              See all results
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton className="data-[state=open]:bg-secondary data-[state=open]:text-primary">
          <Search className="size-4 shrink-0" />
          <div className="flex flex-1 overflow-hidden">
            <p className="line-clamp-1 pr-6">Search</p>
          </div>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={4}
        className="w-96 p-0"
      >
        <form>
          <div className="border-b p-2.5">
            <Input
              type="search"
              placeholder="Search..."
              className="h-8 rounded-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </form>
        <div className="grid gap-1 p-1.5 text-sm">
          {results.map((result) => (
            <Link
              href={result.url}
              key={result.title}
              className="rounded-md p-2.5 outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
            >
              <div className="font-medium">{result.title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {result.teaser}
              </div>
            </Link>
          ))}
          <Separator className="my-1.5" />
          <Link
            href="#"
            className="rounded-md px-2.5 py-1 text-muted-foreground outline-none ring-ring hover:text-foreground focus-visible:ring-2"
          >
            See all results
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
