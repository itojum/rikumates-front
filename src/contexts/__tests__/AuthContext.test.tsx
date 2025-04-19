import { render, screen as rtlScreen, act } from "@testing-library/react"
import { AuthProvider, useAuthContext } from "../AuthContext"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

// Supabaseクライアントのモック
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}))

// useRouterとusePathnameのモック
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
}))

describe("AuthContext", () => {
  // テスト用のユーザーデータ
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    created_at: new Date().toISOString(),
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    user_metadata: {},
  }

  // テスト用のコンポーネント
  const TestComponent = () => {
    const { user, loading, signOut } = useAuthContext()
    return (
      <div>
        <div data-testid="user-email">{user?.email}</div>
        <div data-testid="loading">{loading ? "loading" : "not loading"}</div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }

  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks()
  })

  it("初期状態ではloadingがtrueでuserがnull", () => {
    const mockSupabase = {
      auth: {
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn(),
      },
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(rtlScreen.getByTestId("loading")).toHaveTextContent("loading")
    expect(rtlScreen.getByTestId("user-email")).toBeEmptyDOMElement()
  })

  it("認証状態が変更された時にuserとloadingが更新される", async () => {
    const mockSupabase = {
      auth: {
        onAuthStateChange: jest.fn().mockImplementation((callback) => {
          // モックのセッションデータ
          const session = { user: mockUser }
          callback("SIGNED_IN", session)
          return { data: { subscription: { unsubscribe: jest.fn() } } }
        }),
        signOut: jest.fn(),
      },
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 非同期処理の完了を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(rtlScreen.getByTestId("loading")).toHaveTextContent("not loading")
    expect(rtlScreen.getByTestId("user-email")).toHaveTextContent(mockUser.email || "")
  })

  it("signOutが呼ばれた時にログアウト処理が実行される", async () => {
    const mockSupabase = {
      auth: {
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // ログアウトボタンをクリック
    await act(async () => {
      rtlScreen.getByText("Sign Out").click()
    })

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })
})
