"use client"

import { FC } from "react"
import { Input as InputBase } from "smarthr-ui"
import styled from "styled-components"
import { FieldProps } from "../types"

const Input = styled(InputBase)`
  height: 32px;
`

export const FormInput: FC<FieldProps<"name" | "industry" | "website">> = ({ field }) => (
  <Input
    {...field}
    width={field.name === "industry" ? 200 : 600}
    onChange={(e) => field.onChange(e.target.value)}
  />
) 