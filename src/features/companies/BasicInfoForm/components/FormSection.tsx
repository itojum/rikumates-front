"use client"

import { FC } from "react"
import { Base, Heading, Stack } from "smarthr-ui"
import { FormSectionProps } from "../types"

export const FormSection: FC<FormSectionProps> = ({ children, title }) => {
  return (
    <Stack style={{ margin: "24px 0" }}>
      <Heading type="sectionTitle">{title}</Heading>
      <Base padding="M">
        {children}
      </Base>
    </Stack>
  )
} 