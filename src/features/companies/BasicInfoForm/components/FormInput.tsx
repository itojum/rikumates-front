"use client"

import { FC } from "react"
import { Input as InputBase } from "smarthr-ui"
import styled from "styled-components"
import { ControllerRenderProps } from "react-hook-form"
import { BasicInfoFormValues } from "../types"

const Input = styled(InputBase)`
  height: 32px;
`

interface FormInputProps {
  field: ControllerRenderProps<BasicInfoFormValues, "name" | "industry" | "website_url">
  width?: number
}

export const FormInput: FC<FormInputProps> = ({ field, width }) => (
  <Input autoComplete="off" value={field.value} onChange={field.onChange} width={width} />
)
