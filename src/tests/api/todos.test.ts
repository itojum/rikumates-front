import { GET, POST } from "@/app/api/v1/todos/routes"
import { GET as GET_TODO, PUT, DELETE } from "@/app/api/v1/todos/[todo_id]/routes"
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

// validateTodoのモック
jest.mock("@/utils/validate", () => ({
  validateTodo: jest.fn().mockImplementation((data) => {
    if (!data.task_name) {
      return { error: "task_name is required" }
    }
    return null
  })
}))

// Requestオブジェクトのモック
global.Request = jest.fn().mockImplementation((input, init) => ({
  ...input,
  ...init,
  headers: new Headers(init?.headers),
  json: () => Promise.resolve(init?.body ? JSON.parse(init.body) : {}),
  url: input,
}))

describe("TODOsAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/v1/todos", () => {
    it("認証済みユーザーのTODO一覧を取得できる", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockTodos = [
        {
          todo_id: "1",
          user_id: "test-user-id",
          company_id: "1",
          task_name: "履歴書作成",
          notes: "書類選考用",
          due_date: "2025-05-01",
          complated: false,
          created_at: "2025-04-20T00:00:00Z",
          updated_at: "2025-04-20T00:00:00Z",
        },
        {
          todo_id: "2",
          user_id: "test-user-id",
          company_id: "2",
          task_name: "面接準備",
          notes: "自己PRを練習する",
          due_date: "2025-05-05",
          complated: false,
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
        data: mockTodos,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockTodos)
      expect(mockSupabase.from).toHaveBeenCalledWith("todos")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("企業IDを指定してTODO一覧を取得できる", async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockTodos = [
        {
          todo_id: "1",
          user_id: "test-user-id",
          company_id: "1",
          task_name: "履歴書作成",
          notes: "書類選考用",
          due_date: "2025-05-01",
          complated: false,
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
        data: mockTodos,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos?company_id=1")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockTodos)
      expect(mockSupabase.from).toHaveBeenCalledWith("todos")
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

      const request = new Request("http://localhost:3000/api/v1/todos")
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

      const request = new Request("http://localhost:3000/api/v1/todos")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("POST /api/v1/todos", () => {
    it("認証済みユーザーがTODOを登録できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockTodo = {
        todo_id: "1",
        user_id: "test-user-id",
        company_id: "1",
        task_name: "履歴書作成",
        notes: "書類選考用",
        due_date: "2025-05-01",
        complated: false,
        created_at: "2025-04-20T00:00:00Z",
        updated_at: "2025-04-20T00:00:00Z",
      }

      // validateTodoをnullを返すようにモック化
      jest.requireMock("@/utils/validate").validateTodo.mockReturnValueOnce(null)

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        data: [mockTodo],
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos", {
        method: "POST",
        body: JSON.stringify({
          title: "履歴書作成",
          location: "自宅",
          notes: "書類選考用",
          scheduled_at: "2025-05-01",
          company_id: "1",
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.data).toEqual([mockTodo])
      expect(mockSupabase.from).toHaveBeenCalledWith("todos")
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          user_id: "test-user-id",
          company_id: "1",
          title: "履歴書作成",
          location: "自宅",
          notes: "書類選考用",
          scheduled_at: "2025-05-01",
        }),
      ])
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

      // バリデーションエラーを返すようにモック化
      jest.requireMock("@/utils/validate").validateTodo.mockReturnValueOnce({ error: "task_name is required" })

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos", {
        method: "POST",
        body: JSON.stringify({
          // task_nameを省略
          notes: "書類選考用",
          due_date: "2025-05-01",
          company_id: "1",
          complated: false,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("task_name is required")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos", {
        method: "POST",
        body: JSON.stringify({
          task_name: "履歴書作成",
          notes: "書類選考用",
          due_date: "2025-05-01",
          company_id: "1",
          complated: false,
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

      // バリデーションエラーがないようにモック化
      jest.requireMock("@/utils/validate").validateTodo.mockReturnValueOnce(null)

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

      const request = new Request("http://localhost:3000/api/v1/todos", {
        method: "POST",
        body: JSON.stringify({
          task_name: "履歴書作成",
          notes: "書類選考用",
          due_date: "2025-05-01",
          company_id: "1",
          complated: false,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("GET /api/v1/todos/[todo_id]", () => {
    it("認証済みユーザーが特定のTODO情報を取得できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockTodo = {
        todo_id: "1",
        user_id: "test-user-id",
        company_id: "1",
        task_name: "履歴書作成",
        notes: "書類選考用",
        due_date: "2025-05-01",
        complated: false,
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
        data: [mockTodo],
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1")
      const response = await GET_TODO(request, { params: { todo_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual([mockTodo])
      expect(mockSupabase.from).toHaveBeenCalledWith("todos")
      expect(mockSupabase.eq).toHaveBeenCalledWith("todo_id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1")
      const response = await GET_TODO(request, { params: { todo_id: "1" } })
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

      const request = new Request("http://localhost:3000/api/v1/todos/1")
      const response = await GET_TODO(request, { params: { todo_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("PUT /api/v1/todos/[todo_id]", () => {
    it("認証済みユーザーがTODO情報を更新できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockUpdatedTodo = {
        todo_id: "1",
        user_id: "test-user-id",
        company_id: "1",
        task_name: "更新されたタスク",
        notes: "更新された備考",
        due_date: "2025-05-10",
        complated: true,
        created_at: "2025-04-20T00:00:00Z",
        updated_at: "2025-04-25T00:00:00Z",
      }

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: mockUpdatedTodo,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1", {
        method: "PUT",
        body: JSON.stringify({
          task_name: "更新されたタスク",
          notes: "更新された備考",
          due_date: "2025-05-10",
          company_id: "1",
          complated: true,
        }),
      })
      const response = await PUT(request, { params: { todo_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockUpdatedTodo)
      expect(mockSupabase.from).toHaveBeenCalledWith("todos")
      expect(mockSupabase.eq).toHaveBeenCalledWith("todo_id", "1")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user-id")
      expect(mockSupabase.update).toHaveBeenCalledWith({
        task_name: "更新されたタスク",
        notes: "更新された備考",
        due_date: "2025-05-10",
        company_id: "1",
        complated: true,
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

      // バリデーションエラーを返すようにモック化
      jest.requireMock("@/utils/validate").validateTodo.mockReturnValueOnce({ error: "task_name is required" })

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1", {
        method: "PUT",
        body: JSON.stringify({
          // task_nameを省略
          notes: "更新された備考",
          due_date: "2025-05-10",
          company_id: "1",
          complated: true,
        }),
      })
      const response = await PUT(request, { params: { todo_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toEqual({ error: "task_name is required" })
    })

    it("認証エラーが発生した場合、500エラーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: "認証エラー" } }),
        },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1", {
        method: "PUT",
        body: JSON.stringify({
          task_name: "更新されたタスク",
          notes: "更新された備考",
          due_date: "2025-05-10",
          company_id: "1",
          complated: true,
        }),
      })
      const response = await PUT(request, { params: { todo_id: "1" } })
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
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1", {
        method: "PUT",
        body: JSON.stringify({
          task_name: "更新されたタスク",
          notes: "更新された備考",
          due_date: "2025-05-10",
          company_id: "1",
          complated: true,
        }),
      })
      const response = await PUT(request, { params: { todo_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })

  describe("DELETE /api/v1/todos/[todo_id]", () => {
    it("認証済みユーザーがTODO情報を削除できる", async () => {
      const mockUser = {
        user: {
          id: "test-user-id",
        },
      }

      const mockDeletedTodo = {
        todo_id: "1",
        user_id: "test-user-id",
        company_id: "1",
        task_name: "履歴書作成",
        notes: "書類選考用",
        due_date: "2025-05-01",
        complated: false,
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
        data: mockDeletedTodo,
        error: null,
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { todo_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockDeletedTodo)
      expect(mockSupabase.from).toHaveBeenCalledWith("todos")
      expect(mockSupabase.eq).toHaveBeenCalledWith("todo_id", "1")
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

      const request = new Request("http://localhost:3000/api/v1/todos/1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { todo_id: "1" } })
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
        data: null,
        error: { message: "データベースエラー" },
      }

      ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

      const request = new Request("http://localhost:3000/api/v1/todos/1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { todo_id: "1" } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("データベースエラー")
    })
  })
})