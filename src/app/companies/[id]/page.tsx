"use client"

import {
  Heading,
  Stack,
  Text,
  UpwardLink,
  Base,
  Cluster,
  Button,
  TextLink,
  FaPencilIcon,
  FaTrashIcon,
  ActionDialog,
  NotificationBar,
} from "smarthr-ui"
import { useGetCompany } from "@/hooks/companies/useGetCompany"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useDeleteCompany } from "@/hooks/companies/useDeleteCompany"
import Link from "next/link"

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id } = params
  const { company, loading, error } = useGetCompany(id as string)
  const { deleteCompany } = useDeleteCompany()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const currentQuery = searchParams.toString()
  const backLink = currentQuery ? `/companies?${currentQuery}` : "/companies"

  const handleDelete = async (closeDialog: () => void) => {
    closeDialog()
    try {
      await deleteCompany(id as string)
      router.push(backLink)
    } catch {
      setNotification({
        message: "企業の削除に失敗しました。",
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
          企業一覧へ戻る
        </UpwardLink>
      </Stack>

      <Stack gap="M">
        <Cluster justify="space-between">
          <Heading type="screenTitle">{company.name}</Heading>
          <Cluster gap="S">
            <Button
              variant="secondary"
              prefix={<FaPencilIcon />}
              onClick={() => router.push(`/companies/${id}/edit${currentQuery ? `?${currentQuery}` : ""}`)}
            >
              編集
            </Button>
            <Button variant="danger" prefix={<FaTrashIcon />} onClick={() => setIsDeleteDialogOpen(true)}>
              削除
            </Button>
          </Cluster>
        </Cluster>

        <Base padding="M">
          <Stack gap="M">
            <Stack>
              <Text color="TEXT_GREY">業種</Text>
              <Text>{company.industry}</Text>
            </Stack>

            <Stack gap="S">
              <Text color="TEXT_GREY">選考状況</Text>
              <Text>{company.status}</Text>
            </Stack>

            <Stack gap="S">
              <Text color="TEXT_GREY">Webサイト</Text>
              {company.website_url && (
                <TextLink href={company.website_url} target="_blank" style={{ width: "fit-content" }}>
                  {company.website_url}
                </TextLink>
              )}
              {!company.website_url && <Text>未設定</Text>}
            </Stack>

            <Stack gap="S">
              <Text color="TEXT_GREY">メモ</Text>
              <Text>{company.notes}</Text>
            </Stack>
          </Stack>
        </Base>
      </Stack>

      <ActionDialog
        isOpen={isDeleteDialogOpen}
        title="企業の削除"
        actionText="削除"
        actionTheme="danger"
        onClickAction={handleDelete}
        onClickClose={() => setIsDeleteDialogOpen(false)}
      >
        <Stack gap="S">
          <Text>以下の企業を削除しますか？　この操作は元に戻せません。</Text>
        </Stack>
      </ActionDialog>

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
