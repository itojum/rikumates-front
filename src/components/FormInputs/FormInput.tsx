import { FieldValues } from "react-hook-form"
import { FormControl, Input, RequiredLabel } from "smarthr-ui"

type Props = {
  title: string
  titleType: "sectionTitle" | "blockTitle" | "subBlockTitle" | "subSubBlockTitle"
  required?: boolean
  errorMessage: string | undefined
  register: FieldValues
  name: string
  width?: string | number
}

export const FormInput = ({ title, titleType, required, errorMessage, register, name, width }: Props) => {
  return (
    <FormControl
      title={title}
      titleType={titleType}
      htmlFor={name}
      errorMessages={errorMessage}
      statusLabels={required ? <RequiredLabel /> : undefined}
    >
      <Input style={{ height: "32px" }} width={width} autoComplete="off" {...register} />
    </FormControl>
  )
}
