'use server'

import { createClient } from '@/lib/supabase/server'
import { handleAuthError } from '@/utils/errorRedirect'

export async function signOut(): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    handleAuthError(error)
  }

  return true
}