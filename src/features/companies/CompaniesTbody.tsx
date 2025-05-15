import { DetailCompany } from "@/types/types"
import { Loader, StatusLabel, Td, Text, TextLink } from "smarthr-ui"

type Props = {
  companies: DetailCompany[]
  loading: boolean
  error: string | null
}

export const CompaniesTbody = ({ companies, loading, error }: Props) => {
  return (
    <tbody>
          {loading && (
            <tr>
              <Td colSpan={7} style={{ textAlign: 'center' }}>
                <Loader />
              </Td>
            </tr>
          )}
          {error && (
            <tr>
              <Td colSpan={7} style={{ textAlign: 'center' }}>
                <Text color="TEXT_RED">エラーが発生しました</Text>
              </Td>
            </tr>
          )}
          {!loading && !error && companies.map((company) => (
            <tr key={company.id}>
              <Td>{company.name}</Td>
              <Td>{company.industry}</Td>
              <Td>
                <StatusLabel>{company.status}</StatusLabel>
              </Td>
              <Td>{company.events[0] ? company.events[0].title : '未設定'}</Td>
              <Td>{company.events[0] ? company.events[0].scheduled_at : '未設定'}</Td>
              <Td>
                {company.website_url && <TextLink href={company.website_url} target="_blank">リンク</TextLink>}
                {!company.website_url && <Text>未設定</Text>}
              </Td>
            </tr>
          ))}

        </tbody>
  )
}
