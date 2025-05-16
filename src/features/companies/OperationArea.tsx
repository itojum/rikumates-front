import { Button, Cluster, FaFilterIcon, FaSortIcon, SearchInput, SegmentedControl, Stack } from "smarthr-ui"

type Props = {
  query: string
  setQuery: (query: string) => void
  currentStatus: string
  setCurrentStatus: (status: string) => void
}

export const OperationArea = ({ query, setQuery, currentStatus, setCurrentStatus }: Props) => {
  return (
    <Stack style={{ padding: '24px' }}>
      <Cluster>
        <Cluster style={{ marginRight: '16px' }}>
          <SearchInput
            tooltipMessage="企業名、業種で検索"
            value={query}
            onChange={(e) => { setQuery(e.target.value) }}
            size={30}
            style={{ height: '100%' }}
          />
          <Button variant="secondary">検索</Button>
        </Cluster>
        <Button variant="secondary" prefix={<FaFilterIcon />}>
          絞り込み
        </Button>
        <Button variant="secondary" prefix={<FaSortIcon />}>
          並び替え
        </Button>
      </Cluster>

      <SegmentedControl
        options={[
          { content: 'テーブル表示', value: 'table' },
          { content: 'カード表示', value: 'card' },
        ]}
        value={currentStatus}
        onClickOption={(value) => setCurrentStatus(value)}
      />
    </Stack>
  )
}