import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CompanyInsert, CompanyUpdate } from '@/types/database';

/**
 * 企業情報を取得するエンドポイント
 * ログインユーザーに紐づく企業情報を全て取得する
 */
export async function GET() {
  // Supabaseクライアントの初期化
  const supabase = await createClient();

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // ユーザーIDに紐づく企業情報の取得
  const { data, error } = await supabase.from('companies').select('*').eq('user_id', user.user?.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 200 });
}

/**
 * 企業情報を登録するエンドポイント
 * @param request - リクエストオブジェクト
 */
export async function POST(request: Request) {
  // リクエストボディからデータを取得
  const { name, industry, website_url } = await request.json();
  
  // バリデーションチェック
  if(name.length === 0) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
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
  const { data, error } = await supabase.from('companies').insert(insertData);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 200 });
}

/**
 * 企業情報を更新するエンドポイント
 * @param request - リクエストオブジェクト
 */
export async function PUT(request: Request) {
  // リクエストボディからデータを取得
  const { id, name, industry, website_url } = await request.json();

  // バリデーションチェック
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }
  if (!name || name.length === 0) {
    return NextResponse.json({ error: 'name cannot be empty' }, { status: 400 });
  }

  // Supabaseクライアントの初期化
  const supabase = await createClient();

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // 更新データの準備
  const updateData: CompanyUpdate = {
    name,
    industry,
    website_url,
  };

  // データベースへの更新
  const { data: updateResult, error: updateError } = await supabase
    .from('companies')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.user?.id)
    .select();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (!updateResult || updateResult.length === 0) {
    return NextResponse.json({ error: 'Company not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({ data: updateResult[0] }, { status: 200 });
}

