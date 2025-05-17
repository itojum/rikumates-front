"use client"

import { FC } from "react"
import { Stack, Base, Heading } from "smarthr-ui"
import { FormSectionProps } from "../types"

export const FormSection: FC<FormSectionProps> = ({ title, children }) => {
  return (
    <Stack gap="XXS">
      <Heading type="sectionTitle">
        {title}
      </Heading>
      <Base padding="M">
        {children}
      </Base>
    </Stack>
  )
}
