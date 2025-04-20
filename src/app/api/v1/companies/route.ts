import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CompanyInsert } from "@/types/database"

/**
 * 企業情報を取得するエンドポイント
 * ログインユーザーに紐づく企業情報を全て取得する
 */
export async function GET() {
  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // ユーザーIDに紐づく企業情報の取得
  const { data, error } = await supabase.from("companies").select("*").eq("user_id", user.user?.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 200 })
}

/**
 * 企業情報を登録するエンドポイント
 * @param request - リクエストオブジェクト
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const { name, industry, website_url } = await request.json()

    // バリデーションチェック
    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      )
    }

    // Supabaseクライアントの初期化
    const supabase = await createClient()

    // ログインユーザーの取得
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // 登録データの準備
    const insertData: CompanyInsert = {
      user_id: user.user?.id,
      name,
      industry,
      website_url,
    }

    // データベースへの登録
    const { data, error } = await supabase.from("companies").insert(insertData)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: "Failed to insert company" }, { status: 500 })
    }
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Invalid request body"
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
