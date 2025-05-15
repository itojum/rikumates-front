import { DetailCompany } from "@/types/types"
import Link from "next/link"
import { FC } from "react"
import { Base, Button, Cluster, FaUpRightFromSquareIcon, Heading, Loader, StatusLabel, Td, Text } from "smarthr-ui"
import styled from "styled-components"

type Props = {
  companies: DetailCompany[]
  loading: boolean
  error: string | null
}

export const CompanyCards: FC<Props> = ({ companies, loading, error }) => {


  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Text>エラーが発生しました</Text>
  }

  return (
    <Cluster justify="center" gap="L">
      {companies.map((company) => (
        <CompanyCard key={company.id}>
          <Cluster justify="space-between">
            <Heading type="blockTitle">{company.name}</Heading>
            <StatusLabel>{company.status}</StatusLabel>
          </Cluster>
          <Text color="TEXT_GREY">{company.industry}</Text>
          <table>
            <tbody>
              <tr>
                <Td><Text color="TEXT_GREY" size="S">次回選考</Text></Td>
                <Td>{company.events[0] ? company.events[0].title : '未設定'}</Td>
              </tr>
              <tr>
                <Td><Text color="TEXT_GREY" size="S">次回選考日時</Text></Td>
                <Td>{company.events[0] ? company.events[0].scheduled_at : '未設定'}</Td>
              </tr>
            </tbody>
          </table>
          <Cluster justify="space-between">
            <Button disabled={!company.website_url} variant="secondary" prefix={<FaUpRightFromSquareIcon />}>
              <Link href={company.website_url || ''}>ウェブサイト</Link>
            </Button>

            <Button variant="secondary">
              <Link href={`/companies/${company.id}`}>詳細を見る</Link>
            </Button>
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
