import { Dropdown } from "@/components/dropdown"
import { Button, FaFilterIcon, Heading } from "smarthr-ui"

export const FilterButton = () => {
  const onApply = () => {
    console.log("apply")
  }

  return (
    <Dropdown
      trigger={ <Button variant="secondary" suffix={<FaFilterIcon />}>絞り込み</Button> }
      content={
        <FilterContent />
      }
      onApply={onApply}
    />
  )
}

const FilterContent = () => {
  return (
    <>
      <Heading type="sectionTitle">絞り込み</Heading>
      <Heading type="blockTitle">選考ステータス</Heading>
    </>
  )
}