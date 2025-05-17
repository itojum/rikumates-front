"use client"

import { Button, FloatArea, Heading, Stack, Text, UpwardLink } from "smarthr-ui"
import { BasicInfoForm, BasicInfoFormValues } from "@/features/companies/BasicInfoForm"

export default function NewCompanyPage() {
  const handleSubmit = (data: BasicInfoFormValues) => {
    // その他の情報も含めてここでまとめて処理
    console.log("submit data", data)
  }

  return (
    <main>
      <Stack style={{ marginBottom: "24px" }}>
        <UpwardLink href="/companies" indent={2}>企業一覧へ戻る</UpwardLink>
      </Stack>

      <Heading type="screenTitle">新規企業を追加</Heading>
      <Text color="TEXT_GREY">企業情報を入力してください</Text>

      <BasicInfoForm onSubmit={handleSubmit} />

      <FloatArea
        primaryButton={
          <Button type="submit" form="company-form">追加</Button>
        }
        secondaryButton={
          <Button>キャンセル</Button>
        }
      />
    </main>
  )
}