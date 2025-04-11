"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    if (!loading) {
      const publicPaths = ['/login', '/auth', '/', '/error']
      const isPublicPath = publicPaths.some(path => 
        pathname?.startsWith(path) || pathname === path
      )
      
      // 未ログイン時に保護されたパスにアクセスした場合
      if (!isPublicPath && !user) {
        router.push('/login')
      }
      
      // ログイン済み時にログインページにアクセスした場合
      if (isPublicPath && user && pathname !== '/') {
        router.push('/dashboard')
      }
    }
  }, [user, loading, pathname, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext) 