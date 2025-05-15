import { DetailCompany } from "@/types/types"
import { useEffect, useState } from "react"

export const useGetCompanies = () => {
  const [companies, setCompanies] = useState<DetailCompany[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/v1/companies")
        const { data } = await response.json()
        setCompanies(data)
      } catch (error) {
        setError(error as string)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  return { companies, loading, error }
}
