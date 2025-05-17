"use client"

import { FC } from "react";
import { Base, Button, FloatArea, FormControl, Heading, Input as InputBase, RequiredLabel, Select, Stack, Text, UpwardLink } from "smarthr-ui";
import styled from "styled-components";

const STATUS_OPTIONS = [
  { label: "エントリー前", value: "エントリー前" },
  { label: "選考中", value: "選考中" },
  { label: "内定", value: "内定" },
  { label: "辞退", value: "辞退" },
  { label: "お見送り", value: "お見送り" },
]

export default function NewCompanyPage() {
  return (
    <main>

      <Stack style={{ marginBottom: "24px" }}>
        <UpwardLink href="/companies" indent={2} >企業一覧へ戻る</UpwardLink>
      </Stack>

      <Heading type="screenTitle">新規企業を追加</Heading>
      <Text color="TEXT_GREY">企業情報を入力してください</Text>

      <FormSection title="基本情報">

        <form>
          <FormControl title="企業名" statusLabels={<RequiredLabel />}>
            <Input name="name" width={600} />
          </FormControl>
          <FormControl title="業種" statusLabels={<RequiredLabel />}>
            <Input name="industry" width={200} />
          </FormControl>
          <FormControl title="選考状況" statusLabels={<RequiredLabel />}>
            <Select name="status" width={200} options={STATUS_OPTIONS} />
          </FormControl>
          <FormControl title="Webサイト">
            <Input name="website" width={600} />
          </FormControl>
        </form>
      </FormSection>



      <FloatArea
        primaryButton={
          <Button>追加</Button>
        }
        secondaryButton={
          <Button>キャンセル</Button>
        }
      />
    </main>
  )
}

const Input = styled(InputBase)`
  height: 32px;
`

type FormSectionProps = {
  children: React.ReactNode
  title: string
}

const FormSection: FC<FormSectionProps> = ({ children, title }) => {
  return (
    <Stack style={{ margin: "24px 0" }}>
      <Heading type="sectionTitle">{title}</Heading>
      <Base padding="M">
        {children}
      </Base>
    </Stack>
  )
}