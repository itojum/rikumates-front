import { GET, POST, PUT } from "@/app/api/v1/companies/route"
import { createClient } from "@/lib/supabase/server"
import { Json } from "@/types/json"

interface Company {
  id: number
  name: string
  industry: string
  website_url: string
  user_id: string
  created_at: string
  updated_at: string
}

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

describe("Companies API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/v1/companies", () => {
    it("should return companies for authenticated user", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockCompanies = [
        { id: 1, name: "Company 1", industry: "IT", website_url: "https://example1.com" },
        { id: 2, name: "Company 2", industry: "Finance", website_url: "https://example2.com" },
      ]

      // Supabaseクライアントのモック設定
      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockCompanies, error: null }),
          }),
        }),
      })

      // APIの呼び出し
      const response = await GET()
      const data = await response.json()

      // レスポンスの検証
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockCompanies)
    })

    it("should return error when user authentication fails", async () => {
      // 認証エラーのモック設定
      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "Authentication failed" } }),
        },
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Authentication failed")
    })

    it("should return error when database query fails", async () => {
      // ユーザー認証は成功、データベースクエリは失敗するモック設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
          }),
        }),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Database error")
    })

    it("should return companies with correct data structure", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockCompanies = [
        {
          id: 1,
          name: "Company 1",
          industry: "IT",
          website_url: "https://example1.com",
          user_id: "test-user-id",
          created_at: "2024-03-20T12:00:00.000Z",
          updated_at: "2024-03-20T12:00:00.000Z",
        },
        {
          id: 2,
          name: "Company 2",
          industry: "Finance",
          website_url: "https://example2.com",
          user_id: "test-user-id",
          created_at: "2024-03-20T13:00:00.000Z",
          updated_at: "2024-03-20T13:00:00.000Z",
        },
      ]

      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockCompanies, error: null }),
          }),
        }),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBe(2)

      // 各企業データの構造を検証
      data.data.forEach((company: Company) => {
        expect(company).toHaveProperty("id")
        expect(typeof company.id).toBe("number")

        expect(company).toHaveProperty("name")
        expect(typeof company.name).toBe("string")
        expect(company.name.length).toBeGreaterThan(0)

        expect(company).toHaveProperty("industry")
        expect(typeof company.industry).toBe("string")

        expect(company).toHaveProperty("website_url")
        expect(typeof company.website_url).toBe("string")
        expect(company.website_url).toMatch(/^https?:\/\/.+/)

        expect(company).toHaveProperty("user_id")
        expect(typeof company.user_id).toBe("string")
        expect(company.user_id).toBe("test-user-id")

        expect(company).toHaveProperty("created_at")
        expect(new Date(company.created_at).toString()).not.toBe("Invalid Date")

        expect(company).toHaveProperty("updated_at")
        expect(new Date(company.updated_at).toString()).not.toBe("Invalid Date")
      })

      // データの順序を検証（IDの昇順）
      expect(data.data[0].id).toBeLessThan(data.data[1].id)
    })

    it("should return empty array when user has no companies", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBe(0)
    })
  })

  describe("POST /api/v1/companies", () => {
    it("should create a new company successfully", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockInsertData = {
        data: { id: 1, name: "Test Company", industry: "IT", website_url: "https://example.com" },
        error: null,
      }

      // Supabaseクライアントのモック設定
      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockResolvedValue(mockInsertData),
        }),
      })

      // リクエストの作成
      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Company",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })

      // APIの呼び出し
      const response = await POST(request)
      const data = await response.json()

      // レスポンスの検証
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockInsertData.data)
    })

    it("should return error when user authentication fails", async () => {
      // 認証エラーのモック設定
      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "Authentication failed" } }),
        },
      })

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Company",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Authentication failed")
    })

    it("should return error when company creation fails", async () => {
      // ユーザー認証は成功、会社作成は失敗するモック設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
        }),
      })

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Company",
          industry: "IT",
          website_url: "https://example.com",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Database error")
    })
  })

  describe("PUT /api/v1/companies", () => {
    it("should update a company successfully", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockUpdatedCompany = {
        id: 1,
        name: "Updated Company",
        industry: "Updated Industry",
        website_url: "https://updated.com",
        user_id: "test-user-id",
      }

      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: [mockUpdatedCompany], error: null }),
              }),
            }),
          }),
        }),
      })

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          name: "Updated Company",
          industry: "Updated Industry",
          website_url: "https://updated.com",
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockUpdatedCompany)
    })

    it("should return error when id is missing", async () => {
      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Updated Company",
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("id is required")
    })

    it("should return error when name is empty", async () => {
      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          name: "",
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("name cannot be empty")
    })

    it("should return error when user authentication fails", async () => {
      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "Authentication failed" } }),
        },
      })

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          name: "Updated Company",
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Authentication failed")
    })

    it("should return error when company not found", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          }),
        }),
      })

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 999,
          name: "Updated Company",
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Company not found or unauthorized")
    })

    it("should return error when database update fails", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      ;(createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
              }),
            }),
          }),
        }),
      })

      const request = new Request("http://localhost:3000/api/v1/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          name: "Updated Company",
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Database error")
    })
  })
})
