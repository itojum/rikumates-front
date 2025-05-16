import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CompanyInsert } from "@/types/database";

/**
 * 企業情報を取得するエンドポイント
 * ログインユーザーに紐づく企業情報を全て取得する
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 10;
  const offset = (page - 1) * perPage;
  const query = searchParams.get("query") || "";

  // Supabaseクライアントの初期化
  const supabase = await createClient();

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // ユーザーIDに紐づく企業情報の取得
  let companiesQuery = supabase.from("companies")
    .select(
      `
      *,
      events (
        *
      )
    `,
      { count: "exact" },
    )
    .eq("user_id", user.user?.id);

  // 検索クエリがある場合は検索条件を追加
  if (query) {
    companiesQuery = companiesQuery.or(
      `name.ilike.%${query}%,industry.ilike.%${query}%`,
    );
  }

  const { data, error, count } = await companiesQuery
    .range(offset, offset + perPage - 1)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    totalPages: Math.ceil((count || 0) / perPage),
    currentPage: page,
  }, { status: 200 });
}

/**
 * 企業情報を登録するエンドポイント
 * @param request - リクエストオブジェクト
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディからデータを取得
    const { name, industry, website_url } = await request.json();

    // バリデーションチェック
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (name.length > 255) {
      return NextResponse.json({
        error: "name must be less than 255 characters",
      }, { status: 400 });
    } else if (name.length < 1) {
      return NextResponse.json({ error: "name is too short" }, { status: 400 });
    }

    // Supabaseクライアントの初期化
    const supabase = await createClient();

    // ログインユーザーの取得
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // 登録データの準備
    const insertData: CompanyInsert = {
      user_id: user.user?.id,
      name,
      industry,
      website_url,
    };

    // データベースへの登録
    const { data, error } = await supabase.from("companies").insert(insertData);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Failed to insert company" }, {
        status: 500,
      });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Invalid request body";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
