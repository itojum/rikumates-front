// @testing-library/jest-domの拡張機能をインポート
import "@testing-library/jest-dom"

// グローバルなfetchのモック
global.fetch = jest.fn()

// Next.jsのRequestとResponseのモック
class MockHeaders {
  constructor(init) {
    Object.assign(this, init)
  }
}

class MockRequest {
  constructor(input, init = {}) {
    this._url = input
    this.method = init.method || "GET"
    this.headers = new MockHeaders(init.headers || {})
    this._body = init.body
  }

  get url() {
    return this._url
  }

  async json() {
    return JSON.parse(this._body)
  }
}

class MockResponse {
  constructor(body, init = {}) {
    this._body = typeof body === "string" ? body : JSON.stringify(body)
    this.status = init.status || 200
    this.headers = new MockHeaders(init.headers || {})
    this.ok = this.status >= 200 && this.status < 300
  }

  async json() {
    return JSON.parse(this._body)
  }
}

global.Request = MockRequest
global.Response = MockResponse
global.Headers = MockHeaders

// NextRequestのモック
jest.mock("next/server", () => ({
  NextRequest: MockRequest,
  NextResponse: {
    json: (body, init) => new MockResponse(body, init),
  },
}))

// テスト環境での環境変数の設定
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
