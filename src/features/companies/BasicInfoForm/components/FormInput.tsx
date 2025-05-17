"use client"

import { FC } from "react"
import { Input as InputBase } from "smarthr-ui"
import styled from "styled-components"
import { FieldProps } from "../types"

const Input = styled(InputBase)`
  height: 32px;
`

export const FormInput: FC<FieldProps<"name" | "industry" | "website_url">> = ({ field, width }) => (
  <Input {...field} width={width} autoComplete="off" onChange={(e) => field.onChange(e.target.value)} />
)
