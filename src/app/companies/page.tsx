"use client"

import { Base, Button, Center, Cluster, FaCirclePlusIcon, Heading, Pagination, Text } from "smarthr-ui"
import { useGetCompanies } from "@/hooks/companies/useGetCompanies"
import { CompaniesTable } from "@/features/companies/CompaniesTable"
import { useSearchParams } from "next/navigation"
import { CompanyCards } from "@/features/companies/CompanyCards"
import { OperationArea } from "@/features/companies/OperationArea"
import { Suspense } from "react"

function CompaniesContent() {
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1")
  const currentStatus = searchParams.get("status") || "table"

  const { companies, loading, error, totalPages } = useGetCompanies({ currentPage })

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("status", status)
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <main>
      <Cluster style={{ justifyContent: "space-between" }}>
        <div>
          <Heading type="screenTitle">企業一覧</Heading>
          <Text color="TEXT_GREY">就職活動中の企業情報を管理します</Text>
        </div>

        <Button prefix={<FaCirclePlusIcon />} variant="primary">
          新規企業を追加
        </Button>
      </Cluster>

      <Base style={{ marginTop: 20 }}>
        <OperationArea currentStatus={currentStatus} setCurrentStatus={handleStatusChange} />

        {currentStatus === "table" && <CompaniesTable companies={companies} loading={loading} error={error} />}

        {currentStatus === "card" && <CompanyCards companies={companies} loading={loading} error={error} />}
      </Base>

      <Center>
        <Pagination
          current={currentPage}
          total={totalPages}
          padding={5}
          hrefTemplate={(page) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", page.toString())
            return `/companies?${params.toString()}`
          }}
        />
      </Center>
    </main>
  )
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompaniesContent />
    </Suspense>
  )
}
