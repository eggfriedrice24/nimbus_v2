"use client"

import * as React from "react"

import { SignUpForm } from "@/features/auth/components/sign-up-card"

export default function SignUp() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <SignUpForm />
    </div>
  )
}
