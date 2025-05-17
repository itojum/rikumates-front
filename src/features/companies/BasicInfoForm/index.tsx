"use client"

import { FC } from "react"
import { FormControl, RequiredLabel, Stack } from "smarthr-ui"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema } from "@/lib/validations/company"
import { BasicInfoFormProps, BasicInfoFormValues } from "./types"
import { FormSection } from "./components/FormSection"
import { FormSelect } from "./components/FormSelect"
import { FormInput } from "./components/FormInput"
import { FormTextarea } from "./components/FormTextarea"

export const BasicInfoForm: FC<BasicInfoFormProps> = ({ defaultValues, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues,
  })

  return (
    <form id="company-form" onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
      }
    }}>
      <Stack>
        <FormSection title="基本情報">
          <Stack gap="M">
            <FormControl
              title="企業名"
              statusLabels={<RequiredLabel />}
              errorMessages={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <FormInput field={field} width={400} />
                )}
              />
            </FormControl>

            <FormControl
              title="業種"
              statusLabels={<RequiredLabel />}
              errorMessages={errors.industry?.message}
            >
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <FormInput field={field} />
                )}
              />
            </FormControl>

            <FormControl
              title="選考状況"
              statusLabels={<RequiredLabel />}
              errorMessages={errors.status?.message}
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormSelect field={field} />
                )}
              />
            </FormControl>

            <FormControl
              title="企業URL"
              errorMessages={errors.website_url?.message}
            >
              <Controller
                name="website_url"
                control={control}
                render={({ field }) => (
                  <FormInput field={field} width={600} />
                )}
              />
            </FormControl>

            <FormControl
              title="メモ"
              errorMessages={errors.notes?.message}
            >
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <FormTextarea field={field} />
                )}
              />
            </FormControl>
          </Stack>
        </FormSection>
      </Stack>
    </form>
  )
}
