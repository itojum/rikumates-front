"use client"

import { Button, Center, Cluster, FaCirclePlusIcon, Heading, Pagination, SegmentedControl, Text } from "smarthr-ui";
import { useGetCompanies } from "@/hooks/companies/useGetCompanies";
import { CompaniesTable } from "@/features/companies/CompaniesTable";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CompanyCards } from "@/features/companies/CompanyCards";

export default function CompaniesPage() {

  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1")

  const { companies, loading, error, totalPages } = useGetCompanies({ currentPage })

  const [currentStatus, setCurrentStatus] = useState<string>("table")

  return (
    <main>
      <Cluster style={{ justifyContent: 'space-between' }}>
        <div>
          <Heading type="screenTitle">企業一覧</Heading>
          <Text color="TEXT_GREY">就職活動中の企業情報を管理します</Text>
        </div>

        <Button prefix={<FaCirclePlusIcon />} variant="primary">新規企業を追加</Button>
      </Cluster>


      <SegmentedControl
        style={{ margin: '24px 0' }}
        options={[
          { content: 'テーブル表示', value: 'table' },
          { content: 'カード表示', value: 'card' },
        ]}
        value={currentStatus}
        onClickOption={(value) => setCurrentStatus(value)}
      />

      {currentStatus === 'table' && (
        <CompaniesTable companies={companies} loading={loading} error={error} />
      )}

      {currentStatus === 'card' && (
        <CompanyCards companies={companies} loading={loading} error={error} />
      )}

      <Center>
        <Pagination
          current={currentPage}
          total={totalPages}
          padding={5}
          hrefTemplate={(page) => `/companies?page=${page}`}
        />
      </Center>
    </main>
  )
}