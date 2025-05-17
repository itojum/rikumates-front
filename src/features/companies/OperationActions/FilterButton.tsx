import { Button, Select, FaFilterIcon, Heading } from "smarthr-ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import styled from "styled-components"
import { DropdownWithFloatArea } from "@/components/dropdown-with-float-area"

const recruitmentStatusOptions = [
  { label: "すべて", value: "all" },
  { label: "エントリー前", value: "エントリー前" },
  { label: "選考中", value: "選考中" },
  { label: "内定", value: "内定" },
  { label: "お見送り", value: "お見送り" },
]


export const FilterButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentRecruitmentStatus = searchParams.get("recruitment_status") || "all"

  const [tempRecruitmentStatus, setTempRecruitmentStatus] = useState(currentRecruitmentStatus)

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (tempRecruitmentStatus === "all") {
      params.delete("recruitment_status")
    } else {
      params.set("recruitment_status", tempRecruitmentStatus)
    }

    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCancel = () => {
    setTempRecruitmentStatus(currentRecruitmentStatus)
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
          style={{ margin: "16px 0" }}
        />
      </Container>
    </DropdownWithFloatArea>
  )
}

const Container = styled.div`
  padding: 16px;
  min-width: 300px;
`
