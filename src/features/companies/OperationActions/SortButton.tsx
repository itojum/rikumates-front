import { Button, Cluster, FaSortIcon, Heading, RadioButton, Select } from "smarthr-ui"
import { Dropdown } from "@/components/dropdown"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type sortItem = {
  label: string
  value: string
  selected?: boolean
}

const sortItems: sortItem[] = [
  { label: "企業名", value: "companyName" },
  { label: "業種", value: "industry" },
  { label: "次回選考日時", value: "nextEventDate" },
]

export const SortButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || sortItems[0].value
  const order = searchParams.get('order') === "desc" ? "desc" : "asc"

  const onApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const sort = formData.get('sort')?.toString()
    const order = formData.get('order')?.toString()
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort || '')
    params.set('order', order || '')
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <Dropdown
      trigger={<Button variant="secondary" suffix={<FaSortIcon />}>並び替え</Button>}
      content={<SortContent sort={sort} order={order} />}
      onApply={onApply}
    />
  )
}

type Props = {
  sort: string
  order: "asc" | "desc"
}

const SortContent = ({ sort, order }: Props) => {
  return (
    <>
      <Heading type="blockTitle">並び替え項目</Heading>
      <Select
        name="sort"
        options={sortItems}
        defaultValue={sort}
        width="250px"
      />
      <Heading type="blockTitle">並び順</Heading>
      <Cluster>
        <RadioButton name="order" value="asc" defaultChecked={order === "asc"}>昇順</RadioButton>
        <RadioButton name="order" value="desc" defaultChecked={order === "desc"}>降順</RadioButton>
      </Cluster>
    </>
  )
}
