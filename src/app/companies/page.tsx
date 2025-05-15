"use client"

import { Button, Cluster, FaCirclePlusIcon, Heading, Table, Text, Th } from "smarthr-ui";
import { useGetCompanies } from "@/hooks/companies/useGetCompanies";
import { CompaniesTbody } from "@/features/companies/CompaniesTbody";

export default function CompaniesPage() {
  const { companies, loading, error } = useGetCompanies()

  const handleSeed = async () => {
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("シードデータの作成に失敗しました")
      }
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <Cluster style={{ justifyContent: 'space-between' }}>
        <div>
          <Heading type="screenTitle">企業一覧</Heading>
          <Text color="TEXT_GREY">就職活動中の企業情報を管理します</Text>
        </div>

        <Button prefix={<FaCirclePlusIcon />} variant="primary">新規企業を追加</Button>
      </Cluster>
      <Button onClick={handleSeed}>シードデータを作成</Button>
      <Table style={{ marginTop: '24px' }}>
        <thead>
          <tr>
            <Th>企業名</Th>
            <Th>業種</Th>
            <Th>選考状況</Th>
            <Th>次回選考</Th>
            <Th>次回選考日時</Th>
            <Th>Webサイト</Th>
          </tr>
        </thead>

        <CompaniesTbody companies={companies} loading={loading} error={error} />
      </Table>
    </main>
  )
}