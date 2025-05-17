import { CompanyFormValues } from "@/lib/validations/company"

export type BasicInfoFormValues = CompanyFormValues

export interface BasicInfoFormProps {
  defaultValues: BasicInfoFormValues
  onSubmit: (data: BasicInfoFormValues) => void
}

export interface FieldProps<T extends keyof BasicInfoFormValues> {
  label: string
  name: T
  required?: boolean
  error?: string
  width?: string
}

export interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export type LocationOptions = {
  [key: string]: {
    label: string
    value: string
  }
}
