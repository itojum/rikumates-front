import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { companySchema } from "@/lib/validations/company";

/**
 * 企業情報を取得するエンドポイント
 * ログインユーザーに紐づく企業情報を全て取得する
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("per_page")) || 10;
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";
  const recruitmentStatus = searchParams.get("recruitment_status");

  let query = supabase
    .from("companies")
    .select("*", { count: "exact" })
    .order(sort, { ascending: order === "asc" })
    .eq("user_id", user.user?.id);

  if (recruitmentStatus) {
    query = query.eq("status", recruitmentStatus);
  }

  const { data: companies, error, count } = await query.range(
    (page - 1) * perPage,
    page * perPage - 1,
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: companies,
    totalPages: Math.ceil((count || 0) / perPage),
  });
}

/**
 * 企業情報を登録するエンドポイント
 * @param request - リクエストオブジェクト
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = companySchema.parse(body);

    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const insertData = {
      ...validatedData,
      user_id: user.user?.id,
    }

    const { data, error } = await supabase.from("companies").upsert(insertData).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "企業情報の作成に失敗しました" }, {
      status: 500,
    });
  }
}
