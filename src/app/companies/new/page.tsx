"use client"

import { Heading, Stack, Text, UpwardLink, FloatArea, Button, NotificationBar } from "smarthr-ui"
import { BasicInfoForm } from "@/features/companies/BasicInfoForm"
import { BasicInfoFormValues } from "@/features/companies/BasicInfoForm/types"
import { usePostCompany } from "@/hooks/companies/usePostCompany"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewCompanyPage() {
  const router = useRouter()
  const { postCompany } = usePostCompany()
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const handleSubmit = async (data: BasicInfoFormValues) => {
    try {
      await postCompany(data)
      router.push("/companies")
    } catch {
      setNotification({
        message: "企業の追加に失敗しました",
        type: "error",
      })
    }
  }

  return (
    <main>
      <Stack style={{ marginBottom: "24px" }}>
        <UpwardLink href="/companies" indent={2} elementAs={Link}>
          企業一覧へ戻る
        </UpwardLink>
      </Stack>

      <Stack>
        <Heading type="screenTitle">新規企業を追加</Heading>
        <Text color="TEXT_GREY">企業情報を入力してください</Text>

        <BasicInfoForm
          onSubmit={handleSubmit}
          defaultValues={{
            name: "",
            industry: "",
            status: "エントリー前",
            website_url: "",
            notes: "",
          }}
        />
      </Stack>

      <FloatArea
        primaryButton={
          <Button type="submit" form="company-form" variant="primary">
            追加
          </Button>
        }
        secondaryButton={
          <Link href="/companies">
            <Button>キャンセル</Button>
          </Link>
        }
        bottom="M"
      />

      {notification && (
        <NotificationBar
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  )
}
