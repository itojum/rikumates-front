"use client"

import { Button } from "smarthr-ui"
import { signInWithGoogle } from "@/lib/supabase/authGoogle"

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    await signInWithGoogle()
  }
  return <Button onClick={handleGoogleLogin}>Googleでログイン</Button>
}
