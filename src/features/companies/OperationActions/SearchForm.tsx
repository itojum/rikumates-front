import { useState } from "react"
import { Button, SearchInput } from "smarthr-ui"
import styled from "styled-components"
import { usePathname, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

export const SearchForm = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState<string>(searchParams.get("query") || "")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set("query", query)
    } else {
      params.delete("query")
    }
    params.set("page", "1")
    window.history.pushState(null, "", `${pathname}?${params.toString()}`)
    queryClient.invalidateQueries({ queryKey: ["companies"] })
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
