import { redirect } from "next/navigation"

export function handleAuthError(error: Error): void {
  console.error(error.message)
  redirect("/error")
}
