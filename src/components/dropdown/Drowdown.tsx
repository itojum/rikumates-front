import { Dropdown as SmartHRDropdown, DropdownTrigger, DropdownContent, Cluster, Button, Stack } from "smarthr-ui"
import { ReactNode } from "react"
type Props = {
  trigger: ReactNode
  content: ReactNode
  onApply?:any
}

export const Dropdown = ({ trigger, content, onApply }: Props) => {
  return (
    <SmartHRDropdown>
      <DropdownTrigger>
        {trigger}
      </DropdownTrigger>
      <DropdownContent>
        <Stack>
          <Stack style={{ margin: "15px 20px" }}>
            {content}
          </Stack>
          <hr />
          <Cluster style={{ gap: "10px", margin: "15px 20px" }}>
            <Button variant="secondary">
            キャンセル
          </Button>
          <Button variant="primary" onClick={onApply}>
            適用
            </Button>
          </Cluster>
        </Stack>
      </DropdownContent>
    </SmartHRDropdown>
  )
}