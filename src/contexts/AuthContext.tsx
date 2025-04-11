"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { User } from "@supabase/supabase-js"

/**
 * 認証コンテキストの型定義
 */
interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

/**
 * 認証コンテキストのデフォルト値
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

/**
 * 認証プロバイダーコンポーネント
 * 認証状態の管理と画面遷移の制御を行う
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const pathname = usePathname()

  /**
   * 認証状態の変更を監視
   * セッションの変更を検知してユーザー状態を更新
   */
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

  /**
   * 認証状態に応じた画面遷移の制御
   * - 未ログイン時は保護されたパスへのアクセスを制限
   * - ログイン済み時はログインページへのアクセスを制限
   */
  useEffect(() => {
    if (!loading) {
      // 認証が不要なパスの定義
      const publicPaths = ['/login', '/auth', '/', '/error']
      const isPublicPath = publicPaths.some(path => 
        pathname?.startsWith(path) || pathname === path
      )
      
      // 未ログイン時に保護されたパスにアクセスした場合、ログインページにリダイレクト
      if (!isPublicPath && !user) {
        router.push('/login')
      }
      
      // ログイン済み時にログインページにアクセスした場合、ダッシュボードにリダイレクト
      if (isPublicPath && user && pathname !== '/') {
        router.push('/dashboard')
      }
    }
  }, [user, loading, pathname, router])

  /**
   * ログアウト処理
   * Supabaseのログアウトを実行し、ログインページにリダイレクト
   */
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

/**
 * 認証コンテキストを使用するためのカスタムフック
 */
export const useAuthContext = () => useContext(AuthContext) 