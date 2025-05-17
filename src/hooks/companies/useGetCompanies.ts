import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DetailCompany } from "@/types/types"

type Props = {
  currentPage: number
}

interface UseGetCompaniesResult {
  companies: DetailCompany[]
  loading: boolean
  error: string | null
  totalPages: number
}

export const useGetCompanies = ({ currentPage }: Props): UseGetCompaniesResult => {
  const [companies, setCompanies] = useState<DetailCompany[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const sort = searchParams.get("sort") || "name"
  const order = searchParams.get("order") || "asc"
  const recruitmentStatus = searchParams.get("recruitment_status") || "all"
  const nextEvent = searchParams.get("next_event") || "all"

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("page", currentPage.toString())
        if (query) {
          params.set("query", query)
        }
        if (sort) {
          params.set("sort", sort)
        }
        if (order) {
          params.set("order", order)
        }
        if (recruitmentStatus !== "all") {
          params.set("recruitment_status", recruitmentStatus)
        }
        if (nextEvent !== "all") {
          params.set("next_event", nextEvent)
        }

        const response = await fetch(`/api/v1/companies?${params.toString()}`)
        const { data, totalPages: pages } = await response.json()
        setCompanies(data)
        setTotalPages(pages)
      } catch (error) {
        setError(error as string)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [currentPage, query, sort, order, recruitmentStatus, nextEvent])

  return { companies, loading, error, totalPages }
}
