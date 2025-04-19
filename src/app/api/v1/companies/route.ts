import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CompanyInsert } from '@/types/database';

export async function POST(request: Request) {
  const { name, industry, website_url } = await request.json();
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const insertData: CompanyInsert = {
    user_id: user.user?.id,
    name,
    industry,
    website_url,
  };

  const { data, error } = await supabase.from('companies').insert(insertData);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 200 });
}
