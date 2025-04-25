import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { EventInsert } from "@/types/database"
import { validateEvent } from "@/utils/validate"

export const GET = async (request: NextRequest) => {
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
    const { data, error } = await supabase.from("events").select("*").eq("user_id", user.user?.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data }, { status: 200 })
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.user?.id)
    .eq("company_id", companyId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 200 })
}

export const POST = async (request: NextRequest) => {
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
    const insertData: EventInsert = {
      user_id: user.user?.id,
      company_id,
      title,
      location,
      notes,
      scheduled_at,
    }

    const validationError = validateEvent(insertData)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // データの登録
    const { data, error } = await supabase.from("events").insert([insertData])
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
