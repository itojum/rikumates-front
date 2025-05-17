import { NextRequest, NextResponse } from "next/server"
import { companySchema } from "@/lib/validations/company"
import { createClient } from "@/lib/supabase/server"

export const GET = async (request: NextRequest, { params }: { params: Promise<{ company_id: string }> }) => {
  const { company_id } = await params

  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", company_id)
    .eq("user_id", user.user?.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ company_id: string }> }) => {
  const { company_id } = await params

  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const body = await request.json()
  const validatedData = companySchema.parse(body)

  const { data, error } = await supabase
    .from("companies")
    .update(validatedData)
    .eq("id", company_id)
    .eq("user_id", user.user?.id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ company_id: string }> }) => {
  const { company_id } = await params

  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { error } = await supabase.from("companies").delete().eq("id", company_id).eq("user_id", user.user?.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "企業情報を削除しました" })
}
