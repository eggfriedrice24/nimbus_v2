"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"

export function AuthButton() {
  const pathname = usePathname()

  const isSignIn = pathname === "/sign-in"

  return (
    <Button asChild animated={false}>
      <Link href={isSignIn ? "sign-up" : "sign-in"}>
        {isSignIn ? "Sign Up" : "Sign in"}
      </Link>
    </Button>
  )
}
