import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CompanyInsert } from "@/types/database"

/**
 * 企業情報を取得するエンドポイント
 * ログインユーザーに紐づく企業情報を全て取得する
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get("page")) || 1
  const perPage = Number(searchParams.get("per_page")) || 10
  const sort = searchParams.get("sort") || "created_at"
  const order = searchParams.get("order") || "desc"
  const recruitmentStatus = searchParams.get("recruitment_status")

  let query = supabase
    .from("companies")
    .select("*", { count: "exact" })
    .order(sort, { ascending: order === "asc" })

  if (recruitmentStatus) {
    query = query.eq("status", recruitmentStatus)
  }

  const { data: companies, error, count } = await query.range((page - 1) * perPage, page * perPage - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data: companies,
    totalPages: Math.ceil((count || 0) / perPage),
  })
}

/**
 * 企業情報を登録するエンドポイント
 * @param request - リクエストオブジェクト
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディからデータを取得
    const { name, industry, website_url, status, notes } = await request.json()

    // バリデーションチェック
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 })
    }
    if (name.length > 255) {
      return NextResponse.json(
        {
          error: "name must be less than 255 characters",
        },
        { status: 400 }
      )
    } else if (name.length < 1) {
      return NextResponse.json({ error: "name is too short" }, { status: 400 })
    }

    // Supabaseクライアントの初期化
    const supabase = await createClient()

    // ログインユーザーの取得
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError) {
      throw userError
    }

    // 登録データの準備
    const insertData: CompanyInsert = {
      user_id: user.user?.id,
      name,
      industry,
      website_url,
      status,
      notes,
    }

    // データベースへの登録
    const { data, error } = await supabase.from("companies").insert(insertData).select()
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error("Failed to insert company")
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Error creating company:", error)
    return NextResponse.json(
      { error: "Failed to create company" },
      {
        status: 500,
      }
    )
  }
}
