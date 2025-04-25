import { createClient } from "@/lib/supabase/server"
import { TodoUpdate } from "@/types/database"
import { validateTodo } from "@/utils/validate"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest, { params }: { params: Promise<{ todo_id: string }> }) => {
  const { todo_id } = await params

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { data, error } = await supabase.from("todos").select("*").eq("user_id", user.user?.id).eq("todo_id", todo_id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 200 })
}

export const PUT = async (request: Request, { params }: { params: Promise<{ todo_id: string }> }) => {
  const { todo_id } = await params

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { task_name, notes, due_date, company_id, complated } = await request.json()
  const updateData: TodoUpdate = {
    task_name,
    notes,
    due_date,
    company_id,
    complated,
  }
  if (validateTodo(updateData)) {
    return NextResponse.json({ error: validateTodo(updateData) }, { status: 400 })
  }

  // 更新処理
  const { data, error } = await supabase
    .from("todos")
    .update(updateData)
    .eq("user_id", user.user?.id)
    .eq("todo_id", todo_id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 200 })
}

export const DELETE = async (request: Request, { params }: { params: Promise<{ todo_id: string }> }) => {
  const { todo_id } = await params

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // ログインユーザーの取得
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // 削除処理
  const { data, error } = await supabase.from("todos").delete().eq("user_id", user.user?.id).eq("todo_id", todo_id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 200 })
}
