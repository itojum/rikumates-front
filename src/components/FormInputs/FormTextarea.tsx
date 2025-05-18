import { FieldValues } from "react-hook-form"
import { FormControl, RequiredLabel, Textarea } from "smarthr-ui"

type Props = {
  title: string
  titleType: "sectionTitle" | "blockTitle" | "subBlockTitle" | "subSubBlockTitle"
  required?: boolean
  errorMessage: string | undefined
  register: FieldValues
  name: string
  width?: string | number
}

export const FormTextarea = ({ title, titleType, required, errorMessage, register, name, width }: Props) => {
  return (
    <FormControl
      title={title}
      titleType={titleType}
      htmlFor={name}
      errorMessages={errorMessage}
      statusLabels={required ? <RequiredLabel /> : undefined}
    >
      <Textarea width={width} maxLetters={500} maxRows={4} autoComplete="off" {...register} />
    </FormControl>
  )
}
