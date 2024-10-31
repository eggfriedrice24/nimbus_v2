import "@/styles/globals.css"

import { type Metadata } from "next"
import { GeistSans } from "geist/font/sans"

import QueryProvider from "@/components/query-provider"

export const metadata: Metadata = {
  title: "Nimbus",
  description: "Staying above the clouds of productivity.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
