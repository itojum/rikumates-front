import { GET, POST } from '@/app/api/v1/companies/route';
import { createClient } from '@/lib/supabase/server';
import { Json } from '@/types/json';

// NextResponseのモック
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: Json, init?: ResponseInit) => new Response(JSON.stringify(body), init),
  },
}));

// Supabaseクライアントのモック
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Requestオブジェクトのモック
global.Request = jest.fn().mockImplementation((input, init) => ({
  ...input,
  ...init,
  headers: new Headers(init?.headers),
  json: () => Promise.resolve(init?.body ? JSON.parse(init.body) : {}),
}));

describe('Companies API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/companies', () => {
    it('should return companies for authenticated user', async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: 'test-user-id',
        },
      };

      const mockCompanies = [
        { id: 1, name: 'Company 1', industry: 'IT', website_url: 'https://example1.com' },
        { id: 2, name: 'Company 2', industry: 'Finance', website_url: 'https://example2.com' },
      ];

      // Supabaseクライアントのモック設定
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: mockCompanies, error: null }),
          }),
        }),
      });

      // APIの呼び出し
      const response = await GET();
      const data = await response.json();

      // レスポンスの検証
      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockCompanies);
    });

    it('should return error when user authentication fails', async () => {
      // 認証エラーのモック設定
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: 'Authentication failed' } }),
        },
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Authentication failed');
    });

    it('should return error when database query fails', async () => {
      // ユーザー認証は成功、データベースクエリは失敗するモック設定
      const mockUser = {
        user: {
          id: 'test-user-id',
        },
      };

      (createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
          }),
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });
  });

  describe('POST /api/v1/companies', () => {
    it('should create a new company successfully', async () => {
      // モックデータの設定
      const mockUser = {
        user: {
          id: 'test-user-id',
        },
      };

      const mockInsertData = {
        data: { id: 1, name: 'Test Company', industry: 'IT', website_url: 'https://example.com' },
        error: null,
      };

      // Supabaseクライアントのモック設定
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockResolvedValue(mockInsertData),
        }),
      });

      // リクエストの作成
      const request = new Request('http://localhost:3000/api/v1/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Company',
          industry: 'IT',
          website_url: 'https://example.com',
        }),
      });

      // APIの呼び出し
      const response = await POST(request);
      const data = await response.json();

      // レスポンスの検証
      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockInsertData.data);
    });

    it('should return error when user authentication fails', async () => {
      // 認証エラーのモック設定
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: null, error: { message: 'Authentication failed' } }),
        },
      });

      const request = new Request('http://localhost:3000/api/v1/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Company',
          industry: 'IT',
          website_url: 'https://example.com',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Authentication failed');
    });

    it('should return error when company creation fails', async () => {
      // ユーザー認証は成功、会社作成は失敗するモック設定
      const mockUser = {
        user: {
          id: 'test-user-id',
        },
      };

      (createClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        },
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
        }),
      });

      const request = new Request('http://localhost:3000/api/v1/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Company',
          industry: 'IT',
          website_url: 'https://example.com',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });
  });
}); 