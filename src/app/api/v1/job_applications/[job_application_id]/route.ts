import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { job_application_id: string } }) {
  const { job_application_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }
  const { data, error } = await supabase.from("job_applications")
      .select("*").eq("id", job_application_id).eq("user_id", user.user?.id).single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: { job_application_id: string } }) {
  const { job_application_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }
  const { data: existingData } = await supabase.from("job_applications")
    .select("*").eq("id", job_application_id).eq("user_id", user.user?.id).single()
  if (!existingData) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }
  const { data, error } = await supabase
    .from("job_applications")
    .update(await request.json())
    .eq("id", job_application_id)
    .eq("user_id", user.user?.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: { job_application_id: string } }) {
  const { job_application_id } = params
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }
  const { data: existingData } = await supabase.from("job_applications")
    .select("*").eq("id", job_application_id).eq("user_id", user.user?.id).single()
  if (!existingData) {
    return NextResponse.json({ error: "Company not found or unauthorized" }, { status: 404 })
  }
  const { data, error } = await supabase.from("job_applications")
    .delete()
    .eq("id", job_application_id)
    .eq("user_id", user.user?.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
