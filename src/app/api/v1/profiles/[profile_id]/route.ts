import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * 特定のプロフィール情報を取得するAPIエンドポイント
 * @param request - HTTPリクエスト
 * @param params.profile_id - 取得するプロフィールのID
 * @returns プロフィール情報 | エラーメッセージ
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profile_id: string }> },
) {
  const { profile_id } = await params;
  const supabase = await createClient();
  const { error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profile_id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Profile not found or unauthorized" }, {
      status: 404,
    });
  }
  return NextResponse.json(data);
}

/**
 * プロフィール情報を更新するAPIエンドポイント
 * @param request - HTTPリクエスト（更新データを含む）
 * @param params.profile_id - 更新するプロフィールのID
 * @returns 更新後のプロフィール情報 | エラーメッセージ
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ profile_id: string }> },
) {
  const { profile_id } = await params;
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }
  // 更新対象のプロフィールが存在し、かつユーザーが所有者であることを確認
  const { data: existingData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profile_id)
    .eq("user_id", user.user?.id)
    .single();
  if (!existingData) {
    return NextResponse.json({ error: "Profile not found or unauthorized" }, {
      status: 404,
    });
  }
  const { data, error } = await supabase
    .from("profiles")
    .update(await request.json())
    .eq("id", profile_id)
    .eq("user_id", user.user?.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/**
 * プロフィール情報を削除するAPIエンドポイント
 * @param request - HTTPリクエスト
 * @param params.profile_id - 削除するプロフィールのID
 * @returns 削除されたプロフィール情報 | エラーメッセージ
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ profile_id: string }> },
) {
  const { profile_id } = await params;
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }
  // 削除対象のプロフィールが存在し、かつユーザーが所有者であることを確認
  const { data: existingData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profile_id)
    .eq("user_id", user.user?.id)
    .single();
  if (!existingData) {
    return NextResponse.json({ error: "Profile not found or unauthorized" }, {
      status: 404,
    });
  }
  const { data, error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profile_id)
    .eq("user_id", user.user?.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
