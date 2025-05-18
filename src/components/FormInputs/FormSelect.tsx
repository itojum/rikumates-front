import { FieldValues } from "react-hook-form"
import { FormControl, RequiredLabel, Select } from "smarthr-ui"

type Option = {
  label: string
  value: string
}

type Optgroup = {
  label: string
  options: Option[]
}

type Props = {
  title: string
  titleType: "sectionTitle" | "blockTitle" | "subBlockTitle" | "subSubBlockTitle"
  required?: boolean
  errorMessage: string | undefined
  register: FieldValues
  name: string
  options: (Option | Optgroup)[]
  width?: string | number
}

export const FormSelect = ({
  title, 
  titleType, 
  required, 
  errorMessage, 
  register, 
  name, 
  options, 
  width }: Props) => {
  return (
    <FormControl 
      title={title} 
      titleType={titleType} 
      htmlFor={name}
      errorMessages={errorMessage}
      statusLabels={required ? <RequiredLabel /> : undefined}
      >
      <Select
        options={options}
        style={{ height: "32px" }} width={width} 
        autoComplete="off"
        {...register} />
    </FormControl>
  )
}
