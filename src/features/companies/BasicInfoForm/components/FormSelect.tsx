"use client"

import { FC } from "react"
import { Select } from "smarthr-ui"
import { ControllerRenderProps } from "react-hook-form"
import { BasicInfoFormValues } from "../types"
import { STATUS_OPTIONS } from "../constants"

interface FormSelectProps {
  field: ControllerRenderProps<BasicInfoFormValues, "status">
  width?: number
}

export const FormSelect: FC<FormSelectProps> = ({ field, width }) => {
  return <Select options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} width={width} />
}
