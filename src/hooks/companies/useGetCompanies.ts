import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { DetailCompany } from "@/types/types"

interface CompaniesResponse {
  data: DetailCompany[]
  totalPages: number
}

export const useGetCompanies = () => {
  const searchParams = useSearchParams()
  const page = searchParams.get("page") || "1"
  const per_page = searchParams.get("per_page") || "10"
  const sort = searchParams.get("sort") || "created_at"
  const order = searchParams.get("order") || "desc"
  const recruitmentStatus = searchParams.get("recruitment_status")

  const query = new URLSearchParams({
    page,
    per_page,
    sort,
    order,
  })

  if (recruitmentStatus && recruitmentStatus !== "all") {
    query.append("recruitment_status", recruitmentStatus)
  }

  return useQuery<CompaniesResponse>({
    queryKey: ["companies", query.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/v1/companies?${query.toString()}`)
      if (!response.ok) {
        throw new Error("企業一覧の取得に失敗しました")
      }
      return response.json()
    },
    placeholderData: (previousData) => previousData,
  })
}
