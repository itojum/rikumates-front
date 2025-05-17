"use client"

import { FC } from "react"
import { Select } from "smarthr-ui"
import { FieldProps } from "../types"
import { STATUS_OPTIONS } from "../constants"

export const FormSelect: FC<FieldProps<"status">> = ({ field }) => (
  <Select
    name={field.name}
    value={field.value}
    width={200}
    options={STATUS_OPTIONS}
    onChange={(v) => field.onChange(v)}
  />
)
