"use client"

import { FC, KeyboardEvent } from "react"
import { useForm, Controller } from "react-hook-form"
import { FormControl, RequiredLabel, Stack } from "smarthr-ui"
import { BasicInfoFormProps, BasicInfoFormValues, VALIDATION_RULES } from "./types"
import { STATUS_OPTIONS } from "./constants"
import { FormSection } from "./components/FormSection"
import { FormInput } from "./components/FormInput"
import { FormSelect } from "./components/FormSelect"
import { FormTextarea } from "./components/FormTextarea"

export const BasicInfoForm: FC<BasicInfoFormProps> = ({ onSubmit, defaultValues }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormValues>({
    defaultValues: {
      name: "",
      industry: "",
      status: STATUS_OPTIONS[0].value,
      website_url: "",
      notes: "",
      ...defaultValues,
    },
  })

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  return (
      <FormSection title="基本情報">
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="company-form"
          onKeyDown={handleKeyDown}
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
                render={({ field }) => <FormInput field={field} />}
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
              errorMessages={errors.status?.message}
              autoBindErrorInput
            >
              <Controller
                name="status"
                control={control}
                rules={VALIDATION_RULES.status}
                render={({ field }) => <FormSelect field={field} />}
              />
            </FormControl>
            <FormControl
              title="Webサイト"
              errorMessages={errors.website_url?.message}
              autoBindErrorInput
            >
              <Controller
                name="website_url"
                control={control}
                rules={VALIDATION_RULES.website_url}
                render={({ field }) => <FormInput field={field} />}
              />
            </FormControl>

            <FormControl
              title="メモ"
              errorMessages={errors.notes?.message}
              autoBindErrorInput
            >
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
