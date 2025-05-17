import { Company } from "@/types/database"
import { useState, useEffect } from "react"

export const useGetCompany = (id: string) => {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/v1/companies/${id}`)
        const { data, error } = await response.json()
        if (error) {
          throw error
        }
        setCompany(data)
      } catch (error) {
        setError(error as string)
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [id])

  return { company, loading, error }
}
