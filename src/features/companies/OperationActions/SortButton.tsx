import { Button, FaSortIcon, Heading } from "smarthr-ui"
import { Dropdown } from "@/components/dropdown"


type SortArgs = {
  field: string
  order: "asc" | "desc"
}

export const SortButton = () => {
  const onApply = (args: SortArgs) => {
    console.log(args)
  }

  return (
    <Dropdown
      trigger={<Button variant="secondary" suffix={<FaSortIcon />}>並び替え</Button>}
      content={<SortContent />}
      onApply={onApply}
    />
  )
}

const SortContent = () => {
  return (
    <>
      <Heading type="sectionTitle">並び替え</Heading>
      <Heading type="blockTitle">並び替え項目</Heading>
    </>
  )
}
