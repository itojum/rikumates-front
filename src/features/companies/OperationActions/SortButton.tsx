import { Button, FaSortIcon } from "smarthr-ui"

export const SortButton = () => {
  return (
    <Button variant="secondary" prefix={<FaSortIcon />}>
      並び替え
    </Button>
  )
}