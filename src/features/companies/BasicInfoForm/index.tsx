"use client"

import { FC } from "react"
import { useForm, Controller } from "react-hook-form"
import { FormControl, RequiredLabel, Stack } from "smarthr-ui"
import { BasicInfoFormProps, BasicInfoFormValues, VALIDATION_RULES } from "./types"
import { STATUS_OPTIONS } from "./constants"
import { FormSection } from "./components/FormSection"
import { FormInput } from "./components/FormInput"
import { FormSelect } from "./components/FormSelect"
import { FormTextarea } from "./components/FormTextarea"

export const BasicInfoForm: FC<BasicInfoFormProps> = ({ defaultValues, onSubmit }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<BasicInfoFormValues>({
    defaultValues: {
      name: "",
      industry: "",
      recruitment_status: STATUS_OPTIONS[0].value,
      website_url: "",
      notes: "",
      ...defaultValues,
    },
  })

  return (
    <FormSection title="基本情報">
      <form
        id="company-form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)(e)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
          }
        }}
      >
        <Stack gap="S">
          <FormControl
            title="企業名"
            statusLabels={<RequiredLabel />}
            errorMessages={errors.name?.message}
            autoBindErrorInput
          >
            <Controller
              name="name"
              control={control}
              rules={VALIDATION_RULES.name}
              render={({ field }) => <FormInput field={field} width={400} />}
            />
          </FormControl>
          <FormControl
            title="業種"
            statusLabels={<RequiredLabel />}
            errorMessages={errors.industry?.message}
            autoBindErrorInput
          >
            <Controller
              name="industry"
              control={control}
              rules={VALIDATION_RULES.industry}
              render={({ field }) => <FormInput field={field} />}
            />
          </FormControl>
          <FormControl
            title="選考状況"
            statusLabels={<RequiredLabel />}
            errorMessages={errors.recruitment_status?.message}
            autoBindErrorInput
          >
            <Controller
              name="recruitment_status"
              control={control}
              rules={VALIDATION_RULES.recruitment_status}
              render={({ field }) => <FormSelect field={field} />}
            />
          </FormControl>
          <FormControl title="Webサイト" errorMessages={errors.website_url?.message} autoBindErrorInput>
            <Controller
              name="website_url"
              control={control}
              rules={VALIDATION_RULES.website_url}
              render={({ field }) => <FormInput field={field} width={600} />}
            />
          </FormControl>

          <FormControl title="メモ" errorMessages={errors.notes?.message} autoBindErrorInput>
            <Controller
              name="notes"
              control={control}
              rules={VALIDATION_RULES.notes}
              render={({ field }) => <FormTextarea field={field} />}
            />
          </FormControl>
        </Stack>
      </form>
    </FormSection>
  )
}
