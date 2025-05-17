import { ReactNode } from "react"
import { ControllerRenderProps } from "react-hook-form"
import { z } from "zod"

export const VALIDATION_RULES = {
  name: {
    required: "企業名を入力してください",
    maxLength: {
      value: 255,
      message: "企業名は255文字以内で入力してください",
    },
  },
  industry: {
    required: "業種を入力してください",
    maxLength: {
      value: 255,
      message: "業種は255文字以内で入力してください",
    },
  },
  recruitment_status: {
    required: "選考状況を選択してください",
  },
  website_url: {
    pattern: {
      value: /^https?:\/\/.+/,
      message: "URLの形式が正しくありません",
    },
  },
  notes: {
    maxLength: {
      value: 1000,
      message: "メモは1000文字以内で入力してください",
    },
  },
} as const

export const schema = z.object({
  name: z.string().min(1, VALIDATION_RULES.name.required).max(255, VALIDATION_RULES.name.maxLength.message),
  industry: z.string().min(1, VALIDATION_RULES.industry.required).max(255, VALIDATION_RULES.industry.maxLength.message),
  recruitment_status: z.string().min(1, VALIDATION_RULES.recruitment_status.required),
  website_url: z
    .string()
    .regex(/^https?:\/\/.+/, VALIDATION_RULES.website_url.pattern.message)
    .optional()
    .or(z.literal("")),
  notes: z.string().max(1000, VALIDATION_RULES.notes.maxLength.message).optional().or(z.literal("")),
})

export type BasicInfoFormValues = z.infer<typeof schema>

export interface BasicInfoFormProps {
  defaultValues?: Partial<BasicInfoFormValues>
  onSubmit: (data: BasicInfoFormValues) => void
}

export type FieldProps<T extends keyof BasicInfoFormValues> = {
  field: ControllerRenderProps<BasicInfoFormValues, T>
}

export type FormSectionProps = {
  children: ReactNode
  title: string
}
