type PostCompanyProps = {
  name: string
  industry?: string
  website_url?: string
}

export const usePostCompany = () => {
  const postCompany = async (company: PostCompanyProps) => {
    const response = await fetch("/api/v1/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(company),
    })

    if (!response.ok) {
      throw new Error("Failed to post company")
    }

    return response.json()
  }

  return { postCompany }
}
