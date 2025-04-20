import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { JobApplicationInsert } from "@/types/database"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const company_id = searchParams.get("company_id")

  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  if (!company_id) {
    const { data, error } = await supabase.from("job_applications")
      .select("*")
      .eq("user_id", user.user?.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)

  } else {
    const { data, error } = await supabase.from("job_applications")
      .select("*")
      .eq("user_id", user.user?.id)
      .eq("company_id", company_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)

  }
}

export async function POST(request: Request) {
  const { company_id, status } = await request.json()
  if (!company_id || !status) {
    return NextResponse.json({ error: "company_id and status are required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const insertData: JobApplicationInsert = {
    company_id: company_id,
    user_id: user.user?.id,
    status: status,
  }

  const { data, error } = await supabase.from("job_applications").insert(insertData)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
