import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

function getRedirectUrl(request: Request, next: string): string {
  const { origin } = new URL(request.url)
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocalEnv = process.env.NODE_ENV === "development"

  if (isLocalEnv) {
    return `${origin}${next}`
  }

  if (forwardedHost) {
    return `https://${forwardedHost}${next}`
  }

  return `${origin}${next}`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (!code) {
    return NextResponse.redirect(`${new URL(request.url).origin}/auth/auth-code-error`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${new URL(request.url).origin}/auth/auth-code-error`)
  }

  const redirectUrl = getRedirectUrl(request, next)
  return NextResponse.redirect(redirectUrl)
}
