import { ReactNode } from "react"
import { ControllerRenderProps } from "react-hook-form"

export type BasicInfoFormValues = {
  name: string
  industry: string
  status: string
  website_url?: string
  notes?: string
}

export type BasicInfoFormProps = {
  onSubmit: (data: BasicInfoFormValues) => void
  defaultValues?: Partial<BasicInfoFormValues>
}

export type FieldProps<T extends keyof BasicInfoFormValues> = {
  field: ControllerRenderProps<BasicInfoFormValues, T>
}

export type FormSectionProps = {
  children: ReactNode
  title: string
}

export const VALIDATION_RULES = {
  name: {
    required: "企業名は必須です",
    maxLength: {
      value: 100,
      message: "企業名は100文字以内で入力してください",
    },
  },
  industry: {
    required: "業種は必須です",
    maxLength: {
      value: 50,
      message: "業種は50文字以内で入力してください",
    },
  },
  status: {
    required: "選考状況は必須です",
  },
  website_url: {
    pattern: {
      value: /^https?:\/\/.+/,
      message: "有効なURLを入力してください",
    },
    maxLength: {
      value: 200,
      message: "URLは200文字以内で入力してください",
    },
  },
  notes: {
    maxLength: {
      value: 1000,
      message: "メモは1000文字以内で入力してください",
    },
  },
} as const
