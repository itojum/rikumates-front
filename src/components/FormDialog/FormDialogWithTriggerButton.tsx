import { FC, ReactNode, useState } from "react"
import { FormDialog } from "./FormDialog"

type Props = {
  actionButton: ReactNode
  title: string
  content: ReactNode
  actionText: string
  actionTheme?: "primary" | "secondary"
  onClickAction: () => Promise<void>
  onClickClose: () => void
  isValid: boolean
}

export const FormDialogWithTriggerButton: FC<Props> = ({
  actionButton,
  title,
  content,
  actionText,
  actionTheme = "primary",
  onClickAction,
  onClickClose,
  isValid,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClickAction = () => {
    onClickAction()
    if (isValid) {
      setIsOpen(false)
    }
  }

  const handleClickClose = () => {
    onClickClose()
    setIsOpen(false)
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{actionButton}</div>
      <FormDialog
        isOpen={isOpen}
        title={title}
        content={content}
        actionText={actionText}
        actionTheme={actionTheme}
        onClickAction={handleClickAction}
        onClickClose={handleClickClose}
      />
    </>
  )
}