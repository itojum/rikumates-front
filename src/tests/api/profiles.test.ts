import { GET, PUT, DELETE } from "@/app/api/v1/profiles/[profile_id]/routes"
import { createClient } from "@/lib/supabase/server"
import { Json } from "@/types/database"
import { NextRequest } from "next/server"

// NextResponseとNextRequestのモック
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: Json, init?: ResponseInit) => new Response(JSON.stringify(body), init),
  },
  NextRequest: jest.fn().mockImplementation((input, init) => ({
    url: input,
    method: init?.method || "GET",
    headers: new Headers(init?.headers),
    json: () => Promise.resolve(init?.body ? JSON.parse(init.body) : {}),
    nextUrl: new URL(input),
  })),
}))

// Supabaseクライアントのモック
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}))

describe("プロフィールAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/v1/profiles/[profile_id]", () => {
    it("認証済みユーザーが自分のプロフィール情報を取得できる", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockProfile = {
        id: "test-profile-id",
        user_id: "test-user-id",
        name: "テストユーザー",
        email: "test@example.com",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        data: mockProfile,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id")
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProfile)
      expect(mockSupabase.from).toHaveBeenCalledWith("profiles")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-profile-id")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("プロフィールが存在しない場合、404エラーを返す", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        data: null,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id")
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Profile not found or unauthorized")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id")
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })
  })

  describe("PUT /api/v1/profiles/[profile_id]", () => {
    it("認証済みユーザーがプロフィール情報を更新できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockExistingProfile = {
        id: "test-profile-id",
        user_id: "test-user-id",
        name: "古いユーザー名",
        email: "old@example.com",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockUpdatedProfile = {
        id: "test-profile-id",
        user_id: "test-user-id",
        name: "新しいユーザー名",
        email: "new@example.com",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockReturnValue({ data: mockExistingProfile })
          .mockReturnValueOnce({ data: mockExistingProfile })
          .mockReturnValueOnce({ data: mockUpdatedProfile, error: null }),
        data: mockUpdatedProfile,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "PUT",
        body: JSON.stringify({
          name: "新しいユーザー名",
          email: "new@example.com",
        }),
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUpdatedProfile)
      expect(mockSupabase.from).toHaveBeenCalledWith("profiles")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-profile-id")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
      expect(mockSupabase.update).toHaveBeenCalled()
    })

    it("プロフィールが存在しない場合、404エラーを返す", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null }),
        data: null,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "PUT",
        body: JSON.stringify({
          name: "新しいユーザー名",
          email: "new@example.com",
        }),
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Profile not found or unauthorized")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "PUT",
        body: JSON.stringify({
          name: "新しいユーザー名",
          email: "new@example.com",
        }),
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })

    it("データベースエラーが発生した場合、500エラーを返す", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockExistingProfile = {
        id: "test-profile-id",
        user_id: "test-user-id",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockReturnValueOnce({ data: mockExistingProfile })
          .mockReturnValueOnce({ data: null, error: { message: "データベースエラー" } }),
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "PUT",
        body: JSON.stringify({
          name: "新しいユーザー名",
          email: "new@example.com",
        }),
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("DELETE /api/v1/profiles/[profile_id]", () => {
    it("認証済みユーザーがプロフィール情報を削除できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockProfile = {
        id: "test-profile-id",
        user_id: "test-user-id",
        name: "テストユーザー",
        email: "test@example.com",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockReturnValueOnce({ data: mockProfile })
          .mockReturnValueOnce({ data: mockProfile, error: null }),
        data: mockProfile,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "DELETE",
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProfile)
      expect(mockSupabase.from).toHaveBeenCalledWith("profiles")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-profile-id")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
      expect(mockSupabase.delete).toHaveBeenCalled()
    })

    it("プロフィールが存在しない場合、404エラーを返す", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null }),
        data: null,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "DELETE",
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Profile not found or unauthorized")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "DELETE",
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })

    it("データベースエラーが発生した場合、500エラーを返す", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockProfile = {
        id: "test-profile-id",
        user_id: "test-user-id",
        name: "テストユーザー",
        email: "test@example.com",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockReturnValueOnce({ data: mockProfile })
          .mockReturnValueOnce({ data: null, error: { message: "データベースエラー" } }),
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/profiles/test-profile-id", {
        method: "DELETE",
      })
      const params = Promise.resolve({ profile_id: "test-profile-id" })
      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })
})
