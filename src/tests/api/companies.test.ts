import { GET, POST } from "@/app/api/v1/companies/route"
import { GET as GET_COMPANY, PUT, DELETE } from "@/app/api/v1/companies/[company_id]/route"
import { createClient } from "@/lib/supabase/server"
import { Json } from "@/types/database"

// NextResponseのモック
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: Json, init?: ResponseInit) => new Response(JSON.stringify(body), init),
  },
}))

// Supabaseクライアントのモック
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}))

// Requestオブジェクトのモック
global.Request = jest.fn().mockImplementation((input, init) => ({
  ...input,
  ...init,
  headers: new Headers(init?.headers),
  json: () => Promise.resolve(init?.body ? JSON.parse(init.body) : {}),
}))

describe("企業API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/v1/companies", () => {
    it("認証済みユーザーの企業一覧を取得できる", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockCompanies = [
        {
          id: 1,
          name: "テスト企業1",
          industry: "IT",
          website_url: "https://example.com",
          user_id: "test-user-id",
          created_at: "2024-04-20T00:00:00Z",
          updated_at: "2024-04-20T00:00:00Z",
        },
        {
          id: 2,
          name: "テスト企業2",
          industry: "製造",
          website_url: "https://example2.com",
          user_id: "test-user-id",
          created_at: "2024-04-20T00:00:00Z",
          updated_at: "2024-04-20T00:00:00Z",
        },
      ]

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: mockCompanies,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockCompanies)
      expect(mockSupabase.from).toHaveBeenCalledWith("companies")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })
  })

  describe("POST /api/v1/companies", () => {
    it("認証済みユーザーが企業を登録できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockCompany = {
        id: 1,
        name: "テスト企業",
        industry: "IT",
        website_url: "https://example.com",
        user_id: "test-user-id",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        data: mockCompany,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "POST",
        body: JSON.stringify({
          name: "テスト企業",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockCompany)
      expect(mockSupabase.from).toHaveBeenCalledWith("companies")
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        name: "テスト企業",
        industry: "IT",
        website_url: "https://example.com",
        user_id: "test-user-id",
      })
    })

    it("必須パラメータが不足している場合、400エラーを返す", async () => {
      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "POST",
        body: JSON.stringify({
          // nameを省略
          industry: "IT",
          website_url: "https://example.com",
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("name is required")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "POST",
        body: JSON.stringify({
          name: "テスト企業",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })
  })

  describe("GET /api/v1/companies/[company_id]", () => {
    it("認証済みユーザーが特定の企業情報を取得できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockCompany = {
        id: 1,
        name: "テスト企業",
        industry: "IT",
        website_url: "https://example.com",
        user_id: "test-user-id",
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
        data: mockCompany,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1")
      const response = await GET_COMPANY(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockCompany)
      expect(mockSupabase.from).toHaveBeenCalledWith("companies")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("企業が存在しない場合、404エラーを返す", async () => {
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

      const request = new Request("http://localhost:3000/api/v1/companies/1")
      const response = await GET_COMPANY(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Company not found or unauthorized")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1")
      const response = await GET_COMPANY(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })
  })

  describe("PUT /api/v1/companies/[company_id]", () => {
    it("認証済みユーザーが企業情報を更新できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockCompany = {
        id: 1,
        name: "更新された企業",
        industry: "IT",
        website_url: "https://example.com",
        user_id: "test-user-id",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        data: [mockCompany],
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1", {
        method: "PUT",
        body: JSON.stringify({
          name: "更新された企業",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })
      const response = await PUT(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockCompany)
      expect(mockSupabase.from).toHaveBeenCalledWith("companies")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
      expect(mockSupabase.update).toHaveBeenCalledWith({
        name: "更新された企業",
        industry: "IT",
        website_url: "https://example.com",
      })
    })

    it("企業が存在しない場合、404エラーを返す", async () => {
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
        single: jest.fn().mockReturnThis(),
        data: null,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1", {
        method: "PUT",
        body: JSON.stringify({
          name: "更新された企業",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })
      const response = await PUT(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Company not found or unauthorized")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1", {
        method: "PUT",
        body: JSON.stringify({
          name: "更新された企業",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })
      const response = await PUT(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })
  })

  describe("DELETE /api/v1/companies/[company_id]", () => {
    it("認証済みユーザーが企業情報を削除できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockCompany = {
        id: 1,
        name: "テスト企業",
        industry: "IT",
        website_url: "https://example.com",
        user_id: "test-user-id",
        created_at: "2024-04-20T00:00:00Z",
        updated_at: "2024-04-20T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        data: mockCompany,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ message: "Company deleted successfully" })
      expect(mockSupabase.from).toHaveBeenCalledWith("companies")
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("企業が存在しない場合、404エラーを返す", async () => {
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
        single: jest.fn().mockReturnThis(),
        data: null,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Company not found or unauthorized")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/companies/1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { company_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("認証エラー")
    })
  })
})
