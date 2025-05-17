import { prefectures } from "@/constants/prefectures"
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
  status: {
    required: "選考状況を選択してください",
  },
  location: {
    required: "場所を選択してください",
    oneOf: {
      value: prefectures,
      message: "リストから選択してください"
    },
  },
  website_url: {
    pattern: {
      value: /^https?:\/\/.+/,
      message: "URLの形式が正しくありません",
    },
  },
  notes: {
    maxLength: {
      value: 500,
      message: "メモは500文字以内で入力してください",
    },
  },
}

export const companySchema = z.object({
  name: z.string().min(1, VALIDATION_RULES.name.required).max(255, VALIDATION_RULES.name.maxLength.message),
  industry: z.string().min(1, VALIDATION_RULES.industry.required).max(255, VALIDATION_RULES.industry.maxLength.message),
  status: z.string().min(1, VALIDATION_RULES.status.required),
  location: z.string().min(1, VALIDATION_RULES.location.required),
  website_url: z
    .string()
    .regex(/^https?:\/\/.+/, VALIDATION_RULES.website_url.pattern.message)
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500, VALIDATION_RULES.notes.maxLength.message).optional().or(z.literal("")),
})

export type CompanyFormValues = z.infer<typeof companySchema>
