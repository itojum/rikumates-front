import { DetailCompany } from "@/types/types"
import { FC } from "react"
import { Loader, StatusLabel, Table, Td, Text, TextLink, Th } from "smarthr-ui"
import { useSearchParams } from "next/navigation"

type Props = {
  companies: DetailCompany[]
  loading: boolean
  error: string | null
}

export const CompaniesTable: FC<Props> = ({ companies, loading, error }) => {
  const searchParams = useSearchParams()
  const currentQuery = searchParams.toString()

  return (
    <Table>
      <thead>
        <tr>
          <Th>企業名</Th>
          <Th>業種</Th>
          <Th>選考状況</Th>
          <Th>次回選考</Th>
          <Th>次回選考日時</Th>
          <Th>Webサイト</Th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <Td colSpan={7} style={{ textAlign: "center" }}>
              <Loader />
            </Td>
          </tr>
        )}
        {error && (
          <tr>
            <Td colSpan={7} style={{ textAlign: "center" }}>
              <Text color="TEXT_RED">エラーが発生しました</Text>
            </Td>
          </tr>
        )}
        {companies.length === 0 && !loading && !error && (
          <tr>
            <Td colSpan={7} style={{ textAlign: "center", padding: "30px 0" }}>
              <Text>企業が見つかりませんでした</Text>
            </Td>
          </tr>
        )}
        {!loading &&
          !error &&
          companies.length > 0 &&
          companies.map((company) => (
            <tr key={company.id}>
              <Td>
                <TextLink href={`/companies/${company.id}?${currentQuery}`}>{company.name}</TextLink>
              </Td>
              <Td>{company.industry}</Td>
              <Td>
                <StatusLabel>{company.status}</StatusLabel>
              </Td>
              <Td>{company.events[0] ? company.events[0].title : "未設定"}</Td>
              <Td>{company.events[0] ? company.events[0].scheduled_at : "未設定"}</Td>
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
