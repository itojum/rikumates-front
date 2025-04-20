import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/v1/companies/[company_id]/job_applications/routes"
import { createClient } from "@/lib/supabase/server"

// Supabaseクライアントのモック
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}))

describe("GET /api/v1/companies/[company_id]/job_applications", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("認証済みユーザーの応募情報を取得できる", async () => {
    const mockUser = {
      user: {
        id: "test-user-id",
      },
    }

    const mockData = [
      {
        id: "1",
        company_id: "test-company-id",
        user_id: "test-user-id",
        created_at: "2024-04-20T00:00:00Z",
      },
    ]

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      data: mockData,
      error: null,
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/companies/test-company-id/job_applications")
    const response = await GET(request, { params: { company_id: "test-company-id" } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockData)
  })

  it("認証エラーが発生した場合、500エラーを返す", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
      },
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/companies/test-company-id/job_applications")
    const response = await GET(request, { params: { company_id: "test-company-id" } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("認証エラー")
  })
})

describe("POST /api/v1/companies/[company_id]/job_applications", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("認証済みユーザーが応募できる", async () => {
    const mockUser = {
      user: {
        id: "test-user-id",
      },
    }

    const mockData = {
      id: "1",
      company_id: "test-company-id",
      user_id: "test-user-id",
      created_at: "2024-04-20T00:00:00Z",
    }

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      data: mockData,
      error: null,
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/companies/test-company-id/job_applications")
    const response = await POST(request, { params: { company_id: "test-company-id" } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockData)
  })

  it("認証エラーが発生した場合、500エラーを返す", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
      },
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/companies/test-company-id/job_applications")
    const response = await POST(request, { params: { company_id: "test-company-id" } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("認証エラー")
  })
}) 