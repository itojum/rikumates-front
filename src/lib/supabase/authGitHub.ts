"use server"

import { createClient } from "@/lib/supabase/server"
import { handleAuthError } from "@/utils/errorRedirect"
import { redirect } from "next/navigation"

export async function signInWithGitHub(): Promise<void> {
  const supabase = await createClient()

  const {
    data: { url },
    error,
  } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?next=/dashboard`,
      queryParams: {
        access_type: "offline",
      },
    },
  })

  if (error) {
    handleAuthError(error)
  }

  if (url) {
    redirect(url)
  }
}
