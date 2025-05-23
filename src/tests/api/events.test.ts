import { GET, POST } from "@/app/api/v1/events/routes"
import { GET as GET_EVENT, PUT, DELETE } from "@/app/api/v1/events/[event_id]/routes"
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

describe("イベントAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/v1/events", () => {
    it("認証済みユーザーのイベント一覧を取得できる", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockEvents = [
        {
          id: "1",
          user_id: "test-user-id",
          company_id: "1",
          title: "面接",
          location: "東京オフィス",
          notes: "持ち物：履歴書",
          scheduled_at: "2025-04-25T10:00:00Z",
          created_at: "2025-04-20T00:00:00Z",
          updated_at: "2025-04-20T00:00:00Z",
        },
        {
          id: "2",
          user_id: "test-user-id",
          company_id: "2",
          title: "技術面接",
          location: "オンライン",
          notes: "事前課題あり",
          scheduled_at: "2025-04-26T14:00:00Z",
          created_at: "2025-04-20T00:00:00Z",
          updated_at: "2025-04-20T00:00:00Z",
        },
      ]

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: mockEvents,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockEvents)
      expect(mockSupabase.from).toHaveBeenCalledWith("events")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("企業IDを指定してイベント一覧を取得できる", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockEvents = [
        {
          id: "1",
          user_id: "test-user-id",
          company_id: "1",
          title: "面接",
          location: "東京オフィス",
          notes: "持ち物：履歴書",
          scheduled_at: "2025-04-25T10:00:00Z",
          created_at: "2025-04-20T00:00:00Z",
          updated_at: "2025-04-20T00:00:00Z",
        },
      ]

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: mockEvents,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events?company_id=1")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockEvents)
      expect(mockSupabase.from).toHaveBeenCalledWith("events")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
      expect(mockSupabase.eq).toHaveBeenCalledWith("company_id", "1")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events")
      const response = await GET(request)
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

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("POST /api/v1/events", () => {
    it("認証済みユーザーがイベントを登録できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockEvent = {
        id: "1",
        user_id: "test-user-id",
        company_id: "1",
        title: "面接",
        location: "東京オフィス",
        notes: "持ち物：履歴書",
        scheduled_at: "2025-04-25T10:00:00Z",
        created_at: "2025-04-20T00:00:00Z",
        updated_at: "2025-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        data: [mockEvent],
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events", {
        method: "POST",
        body: JSON.stringify({
          title: "面接",
          location: "東京オフィス",
          notes: "持ち物：履歴書",
          scheduled_at: "2025-04-25T10:00:00Z",
          company_id: "1",
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual([mockEvent])
      expect(mockSupabase.from).toHaveBeenCalledWith("events")
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        {
          user_id: "test-user-id",
          company_id: "1",
          title: "面接",
          location: "東京オフィス",
          notes: "持ち物：履歴書",
          scheduled_at: "2025-04-25T10:00:00Z",
        },
      ])
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events", {
        method: "POST",
        body: JSON.stringify({
          title: "面接",
          location: "東京オフィス",
          notes: "持ち物：履歴書",
          scheduled_at: "2025-04-25T10:00:00Z",
          company_id: "1",
        }),
      })
      const response = await POST(request)
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

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events", {
        method: "POST",
        body: JSON.stringify({
          title: "面接",
          location: "東京オフィス",
          notes: "持ち物：履歴書",
          scheduled_at: "2025-04-25T10:00:00Z",
          company_id: "1",
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("GET /api/v1/events/[event_id]", () => {
    it("認証済みユーザーが特定のイベント情報を取得できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockEvent = {
        id: "1",
        user_id: "test-user-id",
        company_id: "1",
        title: "面接",
        location: "東京オフィス",
        notes: "持ち物：履歴書",
        scheduled_at: "2025-04-25T10:00:00Z",
        created_at: "2025-04-20T00:00:00Z",
        updated_at: "2025-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        data: mockEvent,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1")
      const params = Promise.resolve({ event_id: "1" })
      const response = await GET_EVENT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockEvent)
      expect(mockSupabase.from).toHaveBeenCalledWith("events")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("イベントが存在しない場合、エラーを返す", async () => {
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
        error: { message: "イベントが見つかりません" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/999")
      const params = Promise.resolve({ event_id: "999" })
      const response = await GET_EVENT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("イベントが見つかりません")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1")
      const params = Promise.resolve({ event_id: "1" })
      const response = await GET_EVENT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })
  })

  describe("PUT /api/v1/events/[event_id]", () => {
    it("認証済みユーザーがイベント情報を更新できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockUpdatedEvent = [
        {
          id: "1",
          user_id: "test-user-id",
          company_id: "1",
          title: "更新された面接",
          location: "大阪オフィス",
          notes: "持ち物：履歴書、職務経歴書",
          scheduled_at: "2025-04-26T10:00:00Z",
          created_at: "2025-04-20T00:00:00Z",
          updated_at: "2025-04-24T00:00:00Z",
        },
      ]

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        data: mockUpdatedEvent,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1", {
        method: "PUT",
        body: JSON.stringify({
          title: "更新された面接",
          location: "大阪オフィス",
          notes: "持ち物：履歴書、職務経歴書",
          scheduled_at: "2025-04-26T10:00:00Z",
          company_id: "1",
        }),
      })
      const params = Promise.resolve({ event_id: "1" })
      const response = await PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockUpdatedEvent)
      expect(mockSupabase.from).toHaveBeenCalledWith("events")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
      expect(mockSupabase.update).toHaveBeenCalledWith({
        title: "更新された面接",
        location: "大阪オフィス",
        notes: "持ち物：履歴書、職務経歴書",
        scheduled_at: "2025-04-26T10:00:00Z",
        company_id: "1",
      })
    })

    it("バリデーションエラーの場合、400エラーを返す", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
      // validateEventをモック化
      jest.mock("@/utils/validate", () => ({
        validateEvent: () => "タイトルは必須です",
      }))

      const request = new NextRequest("http://localhost:3000/api/v1/events/1", {
        method: "PUT",
        body: JSON.stringify({
          // titleを省略
          location: "大阪オフィス",
          notes: "持ち物：履歴書、職務経歴書",
          scheduled_at: "2025-04-26T10:00:00Z",
          company_id: "1",
        }),
      })
      const params = Promise.resolve({ event_id: "1" })
      const response = await PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty("error")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1", {
        method: "PUT",
        body: JSON.stringify({
          title: "更新された面接",
          location: "大阪オフィス",
          notes: "持ち物：履歴書、職務経歴書",
          scheduled_at: "2025-04-26T10:00:00Z",
          company_id: "1",
        }),
      })
      const params = Promise.resolve({ event_id: "1" })
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

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1", {
        method: "PUT",
        body: JSON.stringify({
          title: "更新された面接",
          location: "大阪オフィス",
          notes: "持ち物：履歴書、職務経歴書",
          scheduled_at: "2025-04-26T10:00:00Z",
          company_id: "1",
        }),
      })
      const params = Promise.resolve({ event_id: "1" })
      const response = await PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("DELETE /api/v1/events/[event_id]", () => {
    it("認証済みユーザーがイベント情報を削除できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockDeletedEvent = {
        id: "1",
        user_id: "test-user-id",
        company_id: "1",
        title: "面接",
        location: "東京オフィス",
        notes: "持ち物：履歴書",
        scheduled_at: "2025-04-25T10:00:00Z",
        created_at: "2025-04-20T00:00:00Z",
        updated_at: "2025-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        data: [mockDeletedEvent],
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1", {
        method: "DELETE",
      })
      const params = Promise.resolve({ event_id: "1" })
      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual([mockDeletedEvent])
      expect(mockSupabase.from).toHaveBeenCalledWith("events")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
      expect(mockSupabase.delete).toHaveBeenCalled()
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1", {
        method: "DELETE",
      })
      const params = Promise.resolve({ event_id: "1" })
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

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new NextRequest("http://localhost:3000/api/v1/events/1", {
        method: "DELETE",
      })
      const params = Promise.resolve({ event_id: "1" })
      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })
})
