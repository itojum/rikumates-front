'use server'

import { createClient } from '@/lib/supabase/server'
import { handleAuthError } from '@/utils/errorRedirect'
import { redirect } from 'next/navigation'

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient()
  
  const { data: { url }, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.SUPABASE_AUTH_URL}/api/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
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