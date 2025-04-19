import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CompanyUpdate } from "@/types/database"

/**
 * 企業情報を更新するエンドポイント
 * @param request - リクエストオブジェクト
 * @param params - パスパラメータ
 */
export async function PUT(
  request: Request,
  { params }: { params: { company_id: string } }
) {
  // リクエストボディからデータを取得
  const { name, industry, website_url } = await request.json()
  const companyId = parseInt(params.company_id)

  // バリデーションチェック
  if (!companyId) {
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
    .eq("id", companyId)
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
 * @param params - パスパラメータ
 */
export async function DELETE(
  request: Request,
  { params }: { params: { company_id: string } }
) {
  const companyId = parseInt(params.company_id)

  // バリデーションチェック
  if (!companyId) {
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
    .eq("id", companyId)
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
