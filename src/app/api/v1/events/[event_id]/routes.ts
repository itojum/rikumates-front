import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { EventInsert } from "@/types/database"
import { validateEvent } from "@/utils/validate"

/**
 * イベント情報を取得するエンドポイント
 * @param request - リクエストオブジェクト
 */
export const GET = async (request: Request, { params }: { params: { event_id: string } }) => {
  const { event_id } = params

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { data, error } = await supabase.from("events")
    .select("*")
    .eq("id", event_id)
    .eq("user_id", user.user?.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 200 })
}

/**
 * イベント情報を更新するエンドポイント
 * @param request -　リクエストオブジェクト
 * @returns 
 */
export const PUT = async (request: Request, { params }: { params: { event_id: string } }) => {
  const { event_id } = params

  // supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { title, location, notes, scheduled_at, company_id } = await request.json()
  const updateData: EventInsert = {
    title,
    location,
    notes,
    scheduled_at,
    company_id
  }
  if(validateEvent(updateData)) {
    return NextResponse.json({ error: validateEvent(updateData) }, { status: 400 })
  }

  const { data: updateResult, error: updateError } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", event_id)
    .eq("user_id", user.user?.id)
    .select()
  
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ data: updateResult }, { status: 200 })
}

/**
 * イベント情報を削除するエンドポイント
 * @param request - リクエストオブジェクト
 */
export const DELETE = async (request: Request, { params }: { params: { event_id: string } }) => {
  const { event_id } = params

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // データベースからの削除
  const { data: deleteResult, error: deleteError } = await supabase
    .from("events")
    .delete()
    .eq("id", event_id)
    .eq("user_id", user.user?.id)
    .select()

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ data: deleteResult }, { status: 200 })
}