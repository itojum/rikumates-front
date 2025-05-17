"use client"

import { Heading, Stack, Text, UpwardLink, FloatArea, Button } from "smarthr-ui"
import { BasicInfoForm } from "@/features/companies/BasicInfoForm"
import { BasicInfoFormValues } from "@/features/companies/BasicInfoForm/types"
import Link from "next/link"

export default function NewCompanyPage() {
  const handleSubmit = (data: BasicInfoFormValues) => {
    console.log("submit data", data)
  }

  return (
    <main>
      <Stack style={{ marginBottom: "24px" }}>
        <UpwardLink href="/companies" indent={2}>
          企業一覧へ戻る
        </UpwardLink>
      </Stack>

      <Stack gap="M">
        <Heading type="screenTitle">新規企業を追加</Heading>
        <Text color="TEXT_GREY">企業情報を入力してください</Text>

        <BasicInfoForm
          onSubmit={handleSubmit}
          defaultValues={{
            name: "",
            industry: "",
            status: "エントリー前",
            website: "",
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
    </main>
  )
}
