import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import 'smarthr-ui/smarthr-ui.css'
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "りくめいつ",
  description: "りくめいつは、就活体験を向上させるためのサービスです。",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode => {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
