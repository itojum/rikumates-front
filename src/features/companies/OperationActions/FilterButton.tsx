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

const nextEventOptions = [
  { label: "すべて", value: "all" },
  { label: "1週間以内", value: "within_week" },
  { label: "2週間以内", value: "within_two_weeks" },
  { label: "1ヶ月以内", value: "within_month" },
]

export const FilterButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentRecruitmentStatus = searchParams.get("recruitment_status") || "all"
  const currentNextEvent = searchParams.get("next_event") || "all"

  const [tempRecruitmentStatus, setTempRecruitmentStatus] = useState(currentRecruitmentStatus)
  const [tempNextEvent, setTempNextEvent] = useState(currentNextEvent)

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (tempRecruitmentStatus === "all") {
      params.delete("recruitment_status")
    } else {
      params.set("recruitment_status", tempRecruitmentStatus)
    }
    if (tempNextEvent === "all") {
      params.delete("next_event")
    } else {
      params.set("next_event", tempNextEvent)
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCancel = () => {
    setTempRecruitmentStatus(currentRecruitmentStatus)
    setTempNextEvent(currentNextEvent)
  }

  return (
    <DropdownWithFloatArea
      trigger={
        <Button variant="secondary" prefix={<FaFilterIcon />}>
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

        <Heading type="blockTitle">次回選考</Heading>
        <Select
          options={nextEventOptions}
          value={tempNextEvent}
          onChange={(e) => setTempNextEvent(e.target.value)}
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
