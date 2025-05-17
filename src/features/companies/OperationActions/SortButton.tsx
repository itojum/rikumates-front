import { Button, Select, RadioButton, FaArrowUpWideShortIcon, FaArrowDownWideShortIcon, Heading } from "smarthr-ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import styled from "styled-components"
import { DropdownWithFloatArea } from "@/components/dropdown-with-float-area"

const sortFields = [
  { label: "企業名", value: "name" },
  { label: "業種", value: "industry" },
  { label: "次回選考日時", value: "next_event_date" },
]

export const SortButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort") || "name"
  const currentOrder = searchParams.get("order") || "asc"

  const [tempSort, setTempSort] = useState(currentSort)
  const [tempOrder, setTempOrder] = useState<"asc" | "desc">(currentOrder as "asc" | "desc")

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", tempSort)
    params.set("order", tempOrder)
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCancel = () => {
    setTempSort(currentSort)
    setTempOrder(currentOrder as "asc" | "desc")
  }

  const getSortLabel = () => {
    const field = sortFields.find((f) => f.value === currentSort)
    const orderLabel = currentOrder === "asc" ? "昇順" : "降順"
    return `${field?.label}(${orderLabel})`
  }

  const getSortIcon = () => {
    return currentOrder === "asc" ? <FaArrowUpWideShortIcon /> : <FaArrowDownWideShortIcon />
  }

  return (
    <DropdownWithFloatArea
      trigger={
        <Button variant="secondary" suffix={getSortIcon()}>
          {getSortLabel()}
        </Button>
      }
      onApply={handleApply}
      onCancel={handleCancel}
    >
      <Container>
        <Heading type="blockTitle">並び替え項目</Heading>
        <Select
          options={sortFields}
          value={tempSort}
          onChange={(e) => setTempSort(e.target.value)}
          width="300px"
          style={{ margin: "16px 0" }}
        />

        <Heading type="blockTitle">並び順</Heading>
        <RadioGroup>
          <RadioButton name="order" value="asc" checked={tempOrder === "asc"} onChange={() => setTempOrder("asc")}>
            昇順
          </RadioButton>
          <RadioButton name="order" value="desc" checked={tempOrder === "desc"} onChange={() => setTempOrder("desc")}>
            降順
          </RadioButton>
        </RadioGroup>
      </Container>
    </DropdownWithFloatArea>
  )
}

const Container = styled.div`
  padding: 16px;
  min-width: 300px;
`

const RadioGroup = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 16px;
`
