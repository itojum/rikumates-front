import { useState } from "react"
import { Button, SearchInput } from "smarthr-ui"
import styled from "styled-components"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const SearchForm = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState<string>(searchParams.get("query") || "")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set("query", query)
    } else {
      params.delete("query")
    }
    params.set("page", "1") // 検索時は1ページ目に戻す
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <SearchInput
        tooltipMessage="企業名、業種で検索"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
        size={30}
        style={{ height: "100%" }}
      />
      <Button variant="secondary" type="submit">
        検索
      </Button>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-right: 16px;
  gap: 8px;
`
