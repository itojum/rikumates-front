import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { FormControl, RequiredLabel, SingleCombobox } from "smarthr-ui"
import { ComboboxItem } from "smarthr-ui/lib/components/Combobox/types"

type Props<T extends FieldValues> = {
  title: string
  titleType: "sectionTitle" | "blockTitle" | "subBlockTitle" | "subSubBlockTitle"
  required?: boolean
  errorMessage: string | undefined
  control: Control<T>
  name: Path<T>
  items: ComboboxItem<unknown>[]
  width?: string | number
}

export const FormCombobox = <T extends FieldValues>({
  title,
  titleType,
  required,
  errorMessage,
  control,
  name,
  items,
  width,
}: Props<T>) => {

  return (
    <FormControl
      title={title}
      titleType={titleType}
      htmlFor={name}
      errorMessages={errorMessage}
      statusLabels={required ? <RequiredLabel /> : undefined}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SingleCombobox
            items={items}
            selectedItem={{ label: field.value, value: field.value }}
            width={width}
            autoComplete="off"
            {...field}
            decorators={{
              noResultText: () => "一致する選択肢がありません。",
            }}
            onChangeInput={(e) => {
              field.onChange(e.target.value)
            }}
            onSelect={(item) => {
              field.onChange(item.value)
            }}
            onClear={() => {
              field.onChange("")
            }}
          />
        )}
      />
    </FormControl>
  )
}
