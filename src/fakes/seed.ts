import { createClient } from "@/lib/supabase/server"
import { fakeCompany } from "./data/companies"

export const seed = async () => {
  const supabase = await createClient()

  for (let i = 0; i < 20; i++) {
    const companies = fakeCompany({ userId: "d46ebaae-23ad-4efe-9078-318a3ab9a7eb" })

    const { data, error } = await supabase.from("companies").insert(companies)
    if (error) {
      console.error(error)
    }
    console.log(data)
  }
}
