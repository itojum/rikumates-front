"use client"

import { FC } from "react"
import { Textarea } from "smarthr-ui"
import { FieldProps } from "../types"

export const FormTextarea: FC<FieldProps<"notes">> = ({ field }) => (
  <Textarea {...field} width={600} onChange={(e) => field.onChange(e.target.value)} />
)
