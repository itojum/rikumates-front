import { Profile } from "@/types/database"
import { useEffect, useState } from "react"

export const useGetProfile = (userId: string) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/v1/profiles/${userId}`)
          const data = await response.json()
          setProfile(data)
        } catch (error) {
          console.error("プロフィールの取得に失敗しました:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchProfile()
  }, [userId])

  return { profile, loading }
}
