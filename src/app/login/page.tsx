"use client"

import GoogleLoginButton from "@/features/auth/Login/GoogleLoginButton"
import GitHubLoginButton from "@/features/auth/Login/GitHubLoginButton"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">ログイン</h1>
        <GoogleLoginButton />
        <GitHubLoginButton />
      </div>
    </div>
  )
}
