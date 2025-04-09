"use client"

import { Button } from "smarthr-ui";
import { signInWithGitHub } from "@/lib/supabase/authGitHub";

export default function GitHubLoginButton() {
  const handleGitHubLogin = async () => {
    await signInWithGitHub();
  }
  return <Button onClick={handleGitHubLogin}>GitHubでログイン</Button>
}