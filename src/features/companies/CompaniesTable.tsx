import { DetailCompany } from "@/types/types"
import { FC } from "react"
import { Loader, StatusLabel, Table, Td, Text, TextLink, Th } from "smarthr-ui"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"

type Props = {
  companies: DetailCompany[]
  loading: boolean
  error: string | null
}

export const CompaniesTable: FC<Props> = ({ companies, loading, error }) => {
  const searchParams = useSearchParams()
  const currentQuery = searchParams.toString()

  if (loading) {
    return (
      <Table>
        <THead />
        <tbody>
          <tr>
            <Td colSpan={7} style={{ textAlign: "center" }}>
              <Loader />
            </Td>
          </tr>
        </tbody>
      </Table>
    )
  }

  if (error) {
    return (
      <Table>
        <THead />
        <tbody>
          <tr>
            <Td colSpan={7} style={{ textAlign: "center" }}>
              <Text color="TEXT_RED">エラーが発生しました</Text>
            </Td>
          </tr>
        </tbody>
      </Table>
    )
  }

  if (companies.length === 0) {
    return (
      <Table>
        <THead />
        <tbody>
          <tr>
            <Td colSpan={7} style={{ textAlign: "center", padding: "30px 0" }}>
              <Text size="L">企業が見つかりませんでした</Text>
            </Td>
          </tr>
        </tbody>
      </Table>
    )
  }

  return (
    <Table>
      <THead />
      <tbody>
        {companies.map((company) => (
          <tr key={company.id}>
            <Td>
              <TextLink href={`/companies/${company.id}?${currentQuery}`} elementAs={Link}>
                {company.name}
              </TextLink>
            </Td>
            <Td>{company.industry}</Td>
            <Td>
              <StatusLabel>{company.status}</StatusLabel>
            </Td>
            <Td>{company.location && <Text>{company.location}</Text>}</Td>
            <Td>{format(new Date(company.created_at), "yyyy/MM/dd")}</Td>
            <Td>
              {company.website_url && (
                <TextLink href={company.website_url} target="_blank">
                  リンク
                </TextLink>
              )}
              {!company.website_url && <Text>未設定</Text>}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

const THead = () => {
  return (
    <thead>
      <tr>
        <Th>企業名</Th>
        <Th>業種</Th>
        <Th>選考状況</Th>
        <Th>場所</Th>
        <Th>作成日</Th>
        <Th>Webサイト</Th>
      </tr>
    </thead>
  )
}
