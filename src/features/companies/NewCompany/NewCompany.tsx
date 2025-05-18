"use client"

import { FormDialog } from "@/components/FormDialog"
import { FormInput } from "@/components/FormInputs/FormInput"
import { FormSelect } from "@/components/FormInputs/FormSelect"
import { FormCombobox } from "@/components/FormInputs/FormCombobox"
import { CompanyFormValues, companySchema } from "@/lib/validations/company"
import { useForm } from "react-hook-form"
import { Button, FaCirclePlusIcon, Stack } from "smarthr-ui"
import { LOCATION_OPTIONS, STATUS_OPTIONS } from "./constants"
import { FormTextarea } from "@/components/FormInputs/FormTextarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePostCompany } from "@/hooks/companies/usePostCompany"

const defaultFormData: CompanyFormValues = {
  name: "",
  website_url: "",
  industry: "",
  location: "",
  notes: "",
  status: "エントリー前",
}

export const NewCompany = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<CompanyFormValues>({
    defaultValues: defaultFormData,
    resolver: zodResolver(companySchema),
    mode: "onChange",
  })

  const { postCompany } = usePostCompany()

  const onSubmit = async (data: CompanyFormValues) => {
    await postCompany(data)
    reset(defaultFormData)
  }

  const onClickClose = () => {
    reset(defaultFormData)
  }

  return (
    <FormDialog
      actionButton={<Button variant="primary" prefix={<FaCirclePlusIcon />}>新規企業を追加</Button>}
      title="新規企業"
      actionText="追加"
      actionTheme="primary"
      onClickAction={() => handleSubmit(onSubmit)()}
      isValid={isValid}
      onClickClose={onClickClose}
      content={
        <form>
          <Stack>
            <FormInput
              title="企業名"
              titleType="blockTitle"
              required
              errorMessage={errors.name?.message}
              register={register("name")}
              name="name"
              width="480px"
            />
            <FormInput
              title="業界"
              titleType="blockTitle"
              required
              errorMessage={errors.industry?.message}
              register={register("industry")}
              name="industry" />
            <FormSelect
              title="選考状況"
              titleType="blockTitle"
              required
              errorMessage={errors.status?.message}
              register={register("status")}
              name="status"
              width="240px"
              options={STATUS_OPTIONS}
            />

            <FormCombobox
              title="場所"
              titleType="blockTitle"
              errorMessage={errors.location?.message}
              control={control}
              name="location"
              items={LOCATION_OPTIONS}
              width="240px"
            />
            <FormTextarea
              title="メモ"
              titleType="blockTitle"
              errorMessage={errors.notes?.message}
              register={register("notes")}
              name="notes"
              width="480px"
            />
          </Stack>
        </form>
      }
    />
  )
}