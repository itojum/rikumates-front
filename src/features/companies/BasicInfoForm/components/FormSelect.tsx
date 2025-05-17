"use client"

import { FC } from "react"
import { Select } from "smarthr-ui"
import { ControllerRenderProps } from "react-hook-form"
import { BasicInfoFormValues } from "../types"

interface FormSelectProps {
  options: { label: string; value: string }[]
  field: ControllerRenderProps<BasicInfoFormValues, "status">
  width?: number
}

export const FormSelect: FC<FormSelectProps> = ({ options, field, width }) => {
  return <Select options={options} value={field.value} onChange={field.onChange} width={width} />
}
