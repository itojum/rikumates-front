"use client"

import { Base, Button, Center, Cluster, FaCirclePlusIcon, Heading, Pagination, Text } from "smarthr-ui"
import { useGetCompanies } from "@/hooks/companies/useGetCompanies"
import { CompaniesTable } from "@/features/companies/CompaniesTable"
import { useSearchParams } from "next/navigation"
import { CompanyCards } from "@/features/companies/CompanyCards"
import { OperationArea } from "@/features/companies/OperationArea"
import { Suspense } from "react"
import Link from "next/link"

function CompaniesContent() {
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1")
  const currentStatus = searchParams.get("status") || "table"

  const { data, isLoading, error } = useGetCompanies()
  const companies = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("status", status)
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <main>
      <Cluster style={{ justifyContent: "space-between" }}>
        <div>
          <Heading type="screenTitle">企業一覧</Heading>
          <Text color="TEXT_GREY">就職活動中の企業情報を管理します</Text>
        </div>

        <Link href="/companies/new">
          <Button prefix={<FaCirclePlusIcon />} variant="primary">
            新規企業を追加
          </Button>
        </Link>
      </Cluster>

      <Base style={{ marginTop: 20 }}>
        <OperationArea currentStatus={currentStatus} setCurrentStatus={handleStatusChange} />

        {currentStatus === "table" && (
          <CompaniesTable companies={companies} loading={isLoading} error={error ? error.message : null} />
        )}

        {currentStatus === "card" && (
          <CompanyCards companies={companies} loading={isLoading} error={error ? error.message : null} />
        )}
      </Base>

      <Center>
        <Pagination current={currentPage} total={totalPages} padding={5} onClick={handlePageChange} />
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
