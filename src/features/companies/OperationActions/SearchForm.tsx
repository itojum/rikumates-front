import { useState } from "react"
import { Button, SearchInput } from "smarthr-ui"
import styled from "styled-components"

export const SearchForm = () => {
  const [query, setQuery] = useState<string>("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(query)
  }
  
  return (
    <Form onSubmit={handleSubmit} >
      <SearchInput
          tooltipMessage="企業名、業種で検索"
          value={query}
          onChange={(e) => { setQuery(e.target.value) }}
          size={30}
          style={{ height: '100%' }}
        />
      <Button variant="secondary" type="submit">検索</Button>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-right: 16px;
  gap: 8px;
`