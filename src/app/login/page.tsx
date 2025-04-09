import GoogleLoginButton from '@/features/auth/Login/GoogleLoginButton'
import GitHubLoginButton from '@/features/auth/Login/GitHubLoginButton'

export default function LoginPage() {
  return (
    <div>
      <GoogleLoginButton />
      <GitHubLoginButton />
    </div>
  )
}