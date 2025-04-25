import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CompanyUpdate } from "@/types/database"

/**
 * 企業情報を取得するエンドポイント
 * @param request - リクエストオブジェクト
 * @param context - ルートコンテキスト
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { company_id: string } }
) {
  const { company_id } = params

  // バリデーションチェック
  if (!company_id) {
    return NextResponse.json({ error: "company_id is required" }, { status: 400 })
  }

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // 企業情報の取得
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", company_id)
    .eq("user_id", user.user?.id)
    .single()

  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 })
  }

  if (!company) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }

  return NextResponse.json({ data: company }, { status: 200 })
}

/**
 * 企業情報を更新するエンドポイント
 * @param request - リクエストオブジェクト
 * @param context - ルートコンテキスト
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { company_id: string } }
) {
  // リクエストボディからデータを取得
  const { name, industry, website_url } = await request.json()
  const { company_id } = params

  // バリデーションチェック
  if (!company_id) {
    return NextResponse.json({ error: "company_id is required" }, { status: 400 })
  }
  if (!name || name.length === 0) {
    return NextResponse.json({ error: "name cannot be empty" }, { status: 400 })
  }

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // 更新データの準備
  const updateData: CompanyUpdate = {
    name,
    industry,
    website_url,
  }

  // データベースへの更新
  const { data: updateResult, error: updateError } = await supabase
    .from("companies")
    .update(updateData)
    .eq("id", company_id)
    .eq("user_id", user.user?.id)
    .select()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  if (!updateResult || updateResult.length === 0) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }

  return NextResponse.json({ data: updateResult[0] }, { status: 200 })
}

/**
 * 企業情報を削除するエンドポイント
 * @param request - リクエストオブジェクト
 * @param context - ルートコンテキスト
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { company_id: string } }
) {
  const { company_id } = params

  // バリデーションチェック
  if (!company_id) {
    return NextResponse.json({ error: "company_id is required" }, { status: 400 })
  }

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // データベースからの削除
  const { data: deleteResult, error: deleteError } = await supabase
    .from("companies")
    .delete()
    .eq("id", company_id)
    .eq("user_id", user.user?.id)
    .select()

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  if (!deleteResult || deleteResult.length === 0) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }

  return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 })
}
