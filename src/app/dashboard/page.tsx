"use client"

import { useAuthContext } from "@/contexts/AuthContext"

export default function DashboardPage(): React.ReactNode {
  const { user, signOut } = useAuthContext()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("ログアウトに失敗しました:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              ログアウト
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">ユーザー情報</h2>
            <p className="text-gray-600">メールアドレス: {user?.email}</p>
            <p className="text-gray-600">UID: {user?.uid}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
