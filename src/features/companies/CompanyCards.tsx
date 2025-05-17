import { DetailCompany } from "@/types/types"
import Link from "next/link"
import { FC } from "react"
import {
  Base,
  Button,
  Cluster,
  FaUpRightFromSquareIcon,
  Heading,
  Loader,
  StatusLabel,
  Text,
  DefinitionListItem,
  DefinitionList,
} from "smarthr-ui"
import styled from "styled-components"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"

type Props = {
  companies: DetailCompany[]
  loading: boolean
  error: string | null
}

export const CompanyCards: FC<Props> = ({ companies, loading, error }) => {
  const searchParams = useSearchParams()
  const currentQuery = searchParams.toString()

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Text>エラーが発生しました</Text>
  }

  if (companies.length === 0) {
    return (
      <Cluster justify="center" style={{ padding: "32px" }}>
        <Text size="L">企業が見つかりませんでした</Text>
      </Cluster>
    )
  }

  return (
    <Cluster justify="center" gap="L">
      {companies.map((company) => (
        <CompanyCard key={company.id}>
          <Cluster justify="space-between">
            <Heading type="blockTitle" style={{ fontSize: "18px" }}>
              {company.name}
            </Heading>
            <StatusLabel>{company.status}</StatusLabel>
          </Cluster>
          <Text color="TEXT_GREY">{company.industry}</Text>

          <div style={{ margin: "16px 0" }}>
            <DefinitionList>
            <DefinitionListItem term="場所">
                {company.location}
              </DefinitionListItem>
              <DefinitionListItem term="作成日">
                {format(new Date(company.created_at), "yyyy/MM/dd")}
              </DefinitionListItem>
            </DefinitionList>
          </div>

          <Cluster justify="space-between">
            <Link href={company.website_url || ""} target="_blank">
              <Button disabled={!company.website_url} variant="secondary" prefix={<FaUpRightFromSquareIcon />}>
                ウェブサイト
              </Button>
            </Link>

            <Link href={`/companies/${company.id}?${currentQuery}`}>
              <Button variant="secondary">詳細を見る</Button>
            </Link>
          </Cluster>
        </CompanyCard>
      ))}
    </Cluster>
  )
}

const CompanyCard = styled(Base)`
  margin: 16px;
  padding: 16px;
  width: 100%;
  max-width: 500px;
  min-width: 320px;
  flex: 1;
`
