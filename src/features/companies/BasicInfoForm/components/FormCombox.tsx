"use client"

import { FC } from "react"
import { SingleCombobox } from "smarthr-ui"
import { ControllerRenderProps } from "react-hook-form"
import { BasicInfoFormValues } from "../types"

interface FormComboxProps {
  options: { label: string; value: string }[]
  field: ControllerRenderProps<BasicInfoFormValues, "location">
  width?: number
}

export const FormCombox: FC<FormComboxProps> = ({ options, field, width }) => {
  const selectedItem = options.find((option) => option.value === field.value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const matchingOption = options.find((option) => option.label.toLowerCase() === inputValue.toLowerCase())
    if (matchingOption) {
      field.onChange(matchingOption.value)
    }
  }

  return (
    <SingleCombobox
      items={options}
      selectedItem={selectedItem ? selectedItem : null}
      onChangeInput={handleChange}
      onSelect={(item) => field.onChange(item.value)}
      onClear={() => field.onChange("")}
      width={width}
      decorators={{
        noResultText: () => "一致する選択肢がありません。",
      }}
    />
  )
}
