import { Button, Select, FaFilterIcon, Heading, SingleCombobox } from "smarthr-ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import styled from "styled-components"
import { DropdownWithFloatArea } from "@/components/dropdown-with-float-area"
import { prefectures } from "@/constants/prefectures"

const recruitmentStatusOptions = [
  { label: "すべて", value: "all" },
  { label: "エントリー前", value: "エントリー前" },
  { label: "選考中", value: "選考中" },
  { label: "内定", value: "内定" },
  { label: "お見送り", value: "お見送り" },
]

const locationOptions = [
  { label: "すべて", value: "すべて" },
  ...Object.values(prefectures).map((prefecture) => ({
    label: prefecture.value,
    value: prefecture.value,
  })),
]

export const FilterButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentRecruitmentStatus = searchParams.get("recruitment_status") || "all"
  const currentLocation = searchParams.get("location") || "すべて"
  
  const [tempRecruitmentStatus, setTempRecruitmentStatus] = useState(currentRecruitmentStatus)
  const [tempLocation, setTempLocation] = useState(currentLocation)
  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (tempRecruitmentStatus === "all") {
      params.delete("recruitment_status")
    } else {
      params.set("recruitment_status", tempRecruitmentStatus)
    }

    if (tempLocation === "all") {
      params.delete("location")
    } else {
      params.set("location", tempLocation)
    }

    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCancel = () => {
    setTempRecruitmentStatus(currentRecruitmentStatus)
    setTempLocation(currentLocation)
  }

  return (
    <DropdownWithFloatArea
      trigger={
        <Button variant="secondary" suffix={<FaFilterIcon />}>
          絞り込み
        </Button>
      }
      onApply={handleApply}
      onCancel={handleCancel}
    >
      <Container>
        <Heading type="blockTitle">選考状況</Heading>
        <Select
          options={recruitmentStatusOptions}
          value={tempRecruitmentStatus}
          onChange={(e) => setTempRecruitmentStatus(e.target.value)}
          width="300px"
        />
      </Container>
      <Container>
        <Heading type="blockTitle">場所</Heading>
        <SingleCombobox
          items={locationOptions}
          selectedItem={{ label: tempLocation, value: tempLocation }}
          onSelect={(item) => setTempLocation(item.value)}
          onClear={() => setTempLocation("")}
          width="300px"
          decorators={{
            noResultText: () => "一致する選択肢がありません。"
          }}
        />
      </Container>
    </DropdownWithFloatArea>
  )
}

const Container = styled.div`
  padding: 16px;
  min-width: 300px;
`
