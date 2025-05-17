"use client"

import { FC } from "react"
import { Select } from "smarthr-ui"
import { FieldProps } from "../types"
import { STATUS_OPTIONS } from "../constants"

export const FormSelect: FC<FieldProps<"recruitment_status">> = ({ field }) => {
  return (
    <Select
      options={STATUS_OPTIONS}
      value={field.value}
      onChange={field.onChange}
      width={200}
    />
  )
}
