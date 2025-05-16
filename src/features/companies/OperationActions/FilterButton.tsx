import { Button, FaFilterIcon } from "smarthr-ui"

export const FilterButton = () => {
  return (
    <Button variant="secondary" prefix={<FaFilterIcon />}>
      絞り込み
    </Button>
  )
}