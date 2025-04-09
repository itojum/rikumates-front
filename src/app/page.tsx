"use client"

import { Heading, Text, Stack } from "smarthr-ui"

export default function HomePage(): React.ReactNode {
  return (
    <main style={{ minHeight: "100vh", padding: "2rem" }}>
      <Stack gap={2}>
        <Heading type="sectionTitle">Rikumatesへようこそ</Heading>
        <Text>チームメイトを見つけよう</Text>
      </Stack>
    </main>
  )
}
