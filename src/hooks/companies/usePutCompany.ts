import { CompanyUpdate } from "@/types/database"

export const usePutCompany = () => {
  const putCompany = async (company: CompanyUpdate) => {
    const response = await fetch(`/api/v1/companies/${company.id}`, {
      method: "PUT",
      body: JSON.stringify(company),

      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.json()
  }

  return { putCompany }
}
