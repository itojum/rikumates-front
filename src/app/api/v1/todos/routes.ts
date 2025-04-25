import { createClient } from "@/lib/supabase/server"
import { validateTodo } from "@/utils/validate"
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
  
  // paramsの取得
  const { searchParams } = new URL(request.url)
  const companyId = searchParams.get("company_id")

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // ユーザーIDに紐づく企業情報の取得
  if (!companyId) {
    const { data, error } = await supabase.from("todos").select("*").eq("user_id", user.user?.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data }, { status: 200 })
  }

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.user?.id)
    .eq("company_id", companyId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 200 })
}

export const POST = async (request: Request) => {
  
  try {
    // リクエストボディからデータを取得
    const { title, location, notes, scheduled_at, company_id } = await request.json()

    // Supabaseクライアントの初期化
    const supabase = await createClient()

    // ログインユーザーの取得
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // 登録データの準備
    const insertData = {
      user_id: user.user?.id,
      company_id,
      title,
      location,
      notes,
      scheduled_at,
    }

    // データのバリデーション
    const validationError = validateTodo(insertData)
    if (validationError) {
      return NextResponse.json({ error: validationError.error }, { status: 400 })
    }

    // データの挿入
    const { data, error: insertError } = await supabase.from("todos").insert([insertData])
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch  {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}