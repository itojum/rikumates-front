"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext"
import { Heading, Text, Stack } from "smarthr-ui"

export default function HomePage(): React.ReactNode {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router])

  // ローディング中は何も表示しない
  if (loading) {
    return null
  }

  return (
    <main style={{ minHeight: "100vh", padding: "2rem" }}>
      <Stack gap={2}>
        <Heading type="sectionTitle">Rikumatesへようこそ</Heading>
        <Text>チームメイトを見つけよう</Text>
      </Stack>
    </main>
  )
}
