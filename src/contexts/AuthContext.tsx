"use client"

import { createContext, useContext, ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import { User } from "firebase/auth"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  signInWithGithub: () => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
