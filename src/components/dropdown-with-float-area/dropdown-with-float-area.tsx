import { Button, Dropdown, DropdownContent, DropdownTrigger, FloatArea, DropdownCloser } from "smarthr-ui"
import { ReactNode } from "react"

type Props = {
  trigger: ReactNode
  children: ReactNode
  onApply: () => void
  onCancel: () => void
  applyText?: string
  cancelText?: string
}

export const DropdownWithFloatArea = ({
  trigger,
  children,
  onApply,
  onCancel,
  applyText = "適用",
  cancelText = "キャンセル",
}: Props) => {
  return (
    <Dropdown>
      <DropdownTrigger>{trigger}</DropdownTrigger>
      <DropdownContent controllable>
        {children}
        <FloatArea
          primaryButton={
            <DropdownCloser>
              <Button variant="primary" onClick={onApply}>
                {applyText}
              </Button>
            </DropdownCloser>
          }
          secondaryButton={
            <DropdownCloser>
              <Button onClick={onCancel}>{cancelText}</Button>
            </DropdownCloser>
          }
          bottom={0}
        />
      </DropdownContent>
    </Dropdown>
  )
}
