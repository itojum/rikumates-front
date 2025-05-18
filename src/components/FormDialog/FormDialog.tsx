import { ActionDialog, Stack } from "smarthr-ui"
import { FC } from "react"
type Props = {
  title: string
  isOpen: boolean
  onClickAction: () => void
  onClickClose: () => void
  content: React.ReactNode
  actionText: string
  actionTheme?: "primary" | "secondary"
}

export const FormDialog: FC<Props> = ({ 
  isOpen, 
  title, 
  content, 
  onClickClose, 
  onClickAction, 
  actionText, 
  actionTheme
}) => {
  return <ActionDialog
    title={title} 
    isOpen={isOpen} 
    onClickClose={onClickClose}
    onClickAction={onClickAction}
    actionText={actionText}
    actionTheme={actionTheme}
    contentBgColor="BACKGROUND"
    width="calc(100vw - 16px)"
  >
    <Stack style={{ margin: "0 5vw" }}>
      {content}
    </Stack>
  </ActionDialog>
}