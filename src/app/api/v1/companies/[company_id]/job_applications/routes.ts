import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { company_id: string } }) {
  const { company_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { data, error } = await supabase.from("job_applications")
      .select("*")
      .eq("company_id", company_id)
      .eq("user_id", user.user?.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request: Request, { params }: { params: { company_id: string } }) {
  const { company_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const { data, error } = await supabase.from("job_applications").insert({
    company_id: company_id,
    user_id: user.user?.id,
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
