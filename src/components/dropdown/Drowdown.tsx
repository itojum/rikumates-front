import { Dropdown as SmartHRDropdown, DropdownTrigger, DropdownContent, Button, Stack, FloatArea, DropdownCloser } from "smarthr-ui"
import { ReactNode } from "react"

type Props = {
  trigger: ReactNode
  content: ReactNode
  onApply?: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
}

export const Dropdown = ({ trigger, content, onApply, onCancel }: Props) => {
  return (
    <SmartHRDropdown>
      <DropdownTrigger>
        {trigger}
      </DropdownTrigger>
      <DropdownContent controllable>
        <form onSubmit={onApply}>
          <Stack style={{ margin: "15px 20px" }}>
            {content}
          </Stack>
          <FloatArea 
            primaryButton={
              <DropdownCloser>
                <Button variant="primary" type="submit">適用</Button>
              </DropdownCloser>
            } 
            secondaryButton={
              <DropdownCloser>
                <Button variant="secondary" onClick={onCancel}>
                  キャンセル
                </Button>
              </DropdownCloser>
            } 
            bottom={0}
          />
        </form>
      </DropdownContent>
    </SmartHRDropdown>
  )
}