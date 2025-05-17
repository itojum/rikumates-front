"use client"

import { Heading, Stack, Text, UpwardLink, FloatArea, Button, NotificationBar } from "smarthr-ui"
import { BasicInfoForm } from "@/features/companies/BasicInfoForm"
import { BasicInfoFormValues } from "@/features/companies/BasicInfoForm/types"
import { useGetCompany } from "@/hooks/companies/useGetCompany"
import { usePutCompany } from "@/hooks/companies/usePutCompany"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function EditCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id } = params
  const { company, loading, error } = useGetCompany(id as string)
  const { putCompany } = usePutCompany()
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const currentQuery = searchParams.toString()
  const backLink = currentQuery ? `/companies/${id}?${currentQuery}` : `/companies/${id}`

  const handleSubmit = async (data: BasicInfoFormValues) => {
    try {
      await putCompany({
        id: id as string,
        ...data,
        status: data.status,
      })
      router.push(backLink)
    } catch {
      setNotification({
        message: "企業情報の更新に失敗しました",
        type: "error",
      })
    }
  }

  if (loading) {
    return (
      <main>
        <Stack gap="M">
          <Heading type="screenTitle">読み込み中...</Heading>
        </Stack>
      </main>
    )
  }

  if (error || !company) {
    return (
      <main>
        <Stack gap="M">
          <Heading type="screenTitle">エラー</Heading>
          <Text color="TEXT_GREY">企業情報の取得に失敗しました</Text>
        </Stack>
      </main>
    )
  }

  return (
    <main>
      <Stack style={{ marginBottom: "24px" }}>
        <UpwardLink href={backLink} indent={2} elementAs={Link}>
          企業詳細へ戻る
        </UpwardLink>
      </Stack>

      <Stack>
        <Heading type="screenTitle">企業情報を編集</Heading>
        <Text color="TEXT_GREY">企業情報を編集してください</Text>

        <BasicInfoForm
          onSubmit={handleSubmit}
          defaultValues={{
            name: company.name,
            industry: company.industry || "",
            status: company.status,
            website_url: company.website_url || "",
            notes: company.notes || "",
          }}
        />
      </Stack>

      <FloatArea
        primaryButton={
          <Button type="submit" form="company-form" variant="primary">
            更新
          </Button>
        }
        secondaryButton={<Button onClick={() => router.push(backLink)}>キャンセル</Button>}
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
