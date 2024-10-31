"use client"

import * as React from "react"

import { LoginCard } from "@/features/auth/components/sign-in-card"

export default function SignIn() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoginCard />
    </div>
  )
}
