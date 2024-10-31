import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Square as FcGoogle } from "lucide-react"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DottedSeparator } from "@/components/ui/separator"

import { useRegister } from "../hooks/use-register"
import { registerSchema, type RegisterSchemaType } from "../schemas/validations"

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

export function SignUpForm() {
  const { mutate } = useRegister()

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(input: RegisterSchemaType) {
    mutate({ json: input })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Name</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} id="last-name" placeholder="Robinson" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="**********"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            <DottedSeparator />
            <Button variant="outline" className="w-full">
              <FcGoogle className="size-6" />
              Sign up with Google
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "link" }), "p-0")}
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
