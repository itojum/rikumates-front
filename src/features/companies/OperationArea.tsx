import { Cluster, SegmentedControl, Stack } from "smarthr-ui"
import { SearchForm } from "./OperationActions/SearchForm"

type Props = {
  currentStatus: string
  setCurrentStatus: (status: string) => void
}

export const OperationArea = ({ currentStatus, setCurrentStatus }: Props) => {
  return (
    <Stack style={{ padding: '24px' }}>
      <Cluster>
        <SearchForm />
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