"use client"

import { useState, useEffect } from "react"
import {
    User,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

// 認証状態の型定義
type AuthState = {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<User>
    signInWithGoogle: () => Promise<User>
    signInWithGithub: () => Promise<User>
    signOut: () => Promise<void>
}

// セッションクッキーの設定
const setSessionCookie = (idToken: string) => {
    document.cookie = `__session=${idToken}; path=/; max-age=3600; secure; samesite=strict`
}

// セッションクッキーの削除
const clearSessionCookie = () => {
    document.cookie = "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

// ポップアップウィンドウの設定
const getPopupConfig = () => ({
    width: "500",
    height: "600",
    left: String(window.screenX + (window.outerWidth - 500) / 2),
    top: String(window.screenY + (window.outerHeight - 600) / 2),
})

export const useAuth = (): AuthState => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // 認証状態の監視
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setUser(user)
                setLoading(false)

                if (user) {
                    // ユーザーがログインしている場合、IDトークンを取得してクッキーに保存
                    const idToken = await user.getIdToken(true)
                    setSessionCookie(idToken)
                    router.push("/dashboard")
                } else {
                    // ユーザーがログアウトしている場合、クッキーを削除
                    clearSessionCookie()
                    router.push("/login")
                }
            } catch (error) {
                console.error("認証状態の更新に失敗しました:", error)
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [router])

    // メールアドレスとパスワードでのログイン
    const signIn = async (email: string, password: string): Promise<User> => {
        try {
            await setPersistence(auth, browserLocalPersistence)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const idToken = await userCredential.user.getIdToken(true)
            setSessionCookie(idToken)
            return userCredential.user
        } catch (error) {
            console.error("ログインに失敗しました:", error)
            throw error
        }
    }

    // Googleアカウントでのログイン
    const signInWithGoogle = async (): Promise<User> => {
        try {
            await setPersistence(auth, browserLocalPersistence)
            const provider = new GoogleAuthProvider()
            provider.setCustomParameters({
                prompt: "select_account", // 毎回アカウント選択を表示
                ...getPopupConfig(),
            })
            const userCredential = await signInWithPopup(auth, provider)
            const idToken = await userCredential.user.getIdToken(true)
            setSessionCookie(idToken)
            return userCredential.user
        } catch (error) {
            console.error("Googleログインに失敗しました:", error)
            throw error
        }
    }

    // GitHubアカウントでのログイン
    const signInWithGithub = async (): Promise<User> => {
        try {
            await setPersistence(auth, browserLocalPersistence)
            const provider = new GithubAuthProvider()
            provider.setCustomParameters(getPopupConfig())
            const userCredential = await signInWithPopup(auth, provider)
            const idToken = await userCredential.user.getIdToken(true)
            setSessionCookie(idToken)
            return userCredential.user
        } catch (error) {
            console.error("GitHubログインに失敗しました:", error)
            throw error
        }
    }

    // ログアウト
    const signOut = async (): Promise<void> => {
        try {
            await firebaseSignOut(auth)
            clearSessionCookie()
            router.push("/login")
        } catch (error) {
            console.error("ログアウトに失敗しました:", error)
            throw error
        }
    }

    return {
        user,
        loading,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        signOut,
    }
}
