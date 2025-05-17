import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import "smarthr-ui/smarthr-ui.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Header } from "@/components/header"
import { IntlProvider } from "@/components/providers/IntlProvider"
import { QueryProvider } from "@/components/providers/QueryProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "りくめいつ",
  description: "りくめいつは、就活体験を向上させるためのサービスです。",
}

function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <QueryProvider>
          <IntlProvider>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </IntlProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}
