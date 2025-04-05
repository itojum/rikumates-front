import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("__session")

  // 認証が必要なパスのパターン
  const authRequiredPaths = ["/dashboard"]
  const isAuthRequired = authRequiredPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // 認証済みユーザーのみアクセス可能なパスに未認証ユーザーがアクセスした場合
  if (isAuthRequired && !authCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 認証済みユーザーがログインページにアクセスした場合
  if (authCookie && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
