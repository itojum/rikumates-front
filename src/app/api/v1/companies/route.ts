import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CompanyInsert } from "@/types/database"
import { getCompaniesQuery } from "@/lib/supabase/queries"

/**
 * 企業情報を取得するエンドポイント
 * ログインユーザーに紐づく企業情報を全て取得する
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const perPage = parseInt(searchParams.get("per_page") || "10")
  const query = searchParams.get("query") || ""
  const sort = searchParams.get("sort") || "name"
  const order = (searchParams.get("order") as "asc" | "desc") || "asc"
  const recruitmentStatus = searchParams.get("recruitment_status") || "all"
  const nextEvent = searchParams.get("next_event") || "all"

  try {
    // Supabaseクライアントの初期化
    const supabase = await createClient()

    // ログインユーザーの取得
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError) {
      throw userError
    }

    // 企業情報の取得
    const { data, count } = await getCompaniesQuery({
      userId: user.user?.id || "",
      page,
      perPage,
      query,
      sort,
      order,
      recruitmentStatus,
      nextEvent,
    })

    return NextResponse.json(
      {
        data,
        totalPages: Math.ceil(count / perPage),
        currentPage: page,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching companies:", error)
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }
}

/**
 * 企業情報を登録するエンドポイント
 * @param request - リクエストオブジェクト
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディからデータを取得
    const { name, industry, website_url } = await request.json()

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
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
  }
}
