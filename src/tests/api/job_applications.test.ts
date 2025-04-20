import { NextRequest } from "next/server"
import { GET, PUT, DELETE } from "@/app/api/v1/job_applications/[job_application_id]/route"
import { createClient } from "@/lib/supabase/server"

/**
 * 応募情報APIのテストファイル
 * 
 * このファイルでは、以下のAPIエンドポイントのテストを行います：
 * - GET /api/v1/job_applications/[job_application_id] - 特定の応募情報の取得
 * - PUT /api/v1/job_applications/[job_application_id] - 応募情報の更新
 * - DELETE /api/v1/job_applications/[job_application_id] - 応募情報の削除
 * 
 * 各エンドポイントに対して、以下のケースをテストします：
 * - 正常系：認証済みユーザーによる操作
 * - 異常系：存在しないデータへのアクセス（404エラー）
 * - 異常系：認証エラー（500エラー）
 */

// NextResponseのモック
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
  NextRequest: jest.fn().mockImplementation((url, options) => ({
    url,
    method: options?.method || "GET",
    json: () => Promise.resolve(options?.body ? JSON.parse(options.body) : {}),
  })),
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

describe("GET /api/v1/job_applications/[job_application_id]", () => {
  it("認証済みユーザーが特定の応募情報を取得できる", async () => {
    const mockJobApplication = {
      id: 1,
      user_id: "test-user-id",
      company_id: 1,
      status: "応募済み",
      created_at: "2024-04-20T00:00:00Z",
      updated_at: "2024-04-20T00:00:00Z",
    }

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockJobApplication, error: null }),
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: "test-user-id" } }, error: null }),
      },
    }
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1")
    const response = await GET(request, { params: { job_application_id: "1" } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockJobApplication)
    expect(mockSupabase.from).toHaveBeenCalledWith("job_applications")
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
    expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
  })

  it("応募情報が存在しない場合、404エラーを返す", async () => {
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
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1")
    const response = await GET(request, { params: { job_application_id: "1" } })
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

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1")
    const response = await GET(request, { params: { job_application_id: "1" } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("認証エラー")
  })
})

describe("PUT /api/v1/job_applications/[job_application_id]", () => {
  it("認証済みユーザーが応募情報を更新できる", async () => {
    const mockJobApplication = {
      id: 1,
      user_id: "test-user-id",
      company_id: 1,
      status: "面接予定",
      created_at: "2024-04-20T00:00:00Z",
      updated_at: "2024-04-20T00:00:00Z",
    }

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockJobApplication, error: null }),
      update: jest.fn().mockReturnThis(),
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: "test-user-id" } }, error: null }),
      },
    }
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1", {
      method: "PUT",
      body: JSON.stringify({
        status: "面接予定",
      }),
    })
    const response = await PUT(request, { params: { job_application_id: "1" } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockJobApplication)
    expect(mockSupabase.from).toHaveBeenCalledWith("job_applications")
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
    expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
  })

  it("応募情報が存在しない場合、404エラーを返す", async () => {
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
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1", {
      method: "PUT",
      body: JSON.stringify({
        status: "面接予定",
      }),
    })
    const response = await PUT(request, { params: { job_application_id: "1" } })
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

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1", {
      method: "PUT",
      body: JSON.stringify({
        status: "面接予定",
      }),
    })
    const response = await PUT(request, { params: { job_application_id: "1" } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("認証エラー")
  })
})

describe("DELETE /api/v1/job_applications/[job_application_id]", () => {
  it("認証済みユーザーが応募情報を削除できる", async () => {
    const mockJobApplication = {
      id: 1,
      user_id: "test-user-id",
      company_id: 1,
      status: "応募済み",
      created_at: "2024-04-20T00:00:00Z",
      updated_at: "2024-04-20T00:00:00Z",
    }

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockJobApplication, error: null }),
      delete: jest.fn().mockReturnThis(),
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: "test-user-id" } }, error: null }),
      },
    }
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1", {
      method: "DELETE",
    })
    const response = await DELETE(request, { params: { job_application_id: "1" } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockJobApplication)
    expect(mockSupabase.from).toHaveBeenCalledWith("job_applications")
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
    expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
  })

  it("応募情報が存在しない場合、404エラーを返す", async () => {
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
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1", {
      method: "DELETE",
    })
    const response = await DELETE(request, { params: { job_application_id: "1" } })
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

    const request = new NextRequest("http://localhost:3000/api/v1/job_applications/1", {
      method: "DELETE",
    })
    const response = await DELETE(request, { params: { job_application_id: "1" } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("認証エラー")
  })
}) 