import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * 特定の応募情報を取得するAPIエンドポイント
 * @param request - HTTPリクエスト
 * @param params.job_application_id - 取得する応募情報のID
 * @returns 応募情報 | エラーメッセージ
 */
export async function GET(request: Request, { params }: { params: { job_application_id: string } }) {
  const { job_application_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", job_application_id)
    .eq("user_id", user.user?.id)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }
  return NextResponse.json(data)
}

/**
 * 応募情報を更新するAPIエンドポイント
 * @param request - HTTPリクエスト（更新データを含む）
 * @param params.job_application_id - 更新する応募情報のID
 * @returns 更新後の応募情報 | エラーメッセージ
 */
export async function PUT(request: Request, { params }: { params: { job_application_id: string } }) {
  const { job_application_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }
  // 更新対象の応募情報が存在し、かつユーザーが所有者であることを確認
  const { data: existingData } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", job_application_id)
    .eq("user_id", user.user?.id)
    .single()
  if (!existingData) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }
  const { data, error } = await supabase
    .from("job_applications")
    .update(await request.json())
    .eq("id", job_application_id)
    .eq("user_id", user.user?.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

/**
 * 応募情報を削除するAPIエンドポイント
 * @param request - HTTPリクエスト
 * @param params.job_application_id - 削除する応募情報のID
 * @returns 削除された応募情報 | エラーメッセージ
 */
export async function DELETE(request: Request, { params }: { params: { job_application_id: string } }) {
  const { job_application_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }
  // 削除対象の応募情報が存在し、かつユーザーが所有者であることを確認
  const { data: existingData } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", job_application_id)
    .eq("user_id", user.user?.id)
    .single()
  if (!existingData) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }
  const { data, error } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", job_application_id)
    .eq("user_id", user.user?.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
