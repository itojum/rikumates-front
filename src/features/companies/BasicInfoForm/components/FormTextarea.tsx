"use client"

import { FC } from "react"
import { Textarea } from "smarthr-ui"
import { ControllerRenderProps } from "react-hook-form"
import { BasicInfoFormValues } from "../types"

interface FormTextareaProps {
  field: ControllerRenderProps<BasicInfoFormValues, "notes">
}

export const FormTextarea: FC<FormTextareaProps> = ({ field }) => (
  <Textarea value={field.value} onChange={field.onChange} width="100%" />
)
