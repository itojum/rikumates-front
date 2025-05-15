"use client"

import { IntlProvider as ReactIntlProvider } from "react-intl"

const messages = {
  "smarthr-ui/TextLink/openInNewTab": "別タブで開く",
  "smarthr-ui/Pagination/prev": "前へ",
  "smarthr-ui/Pagination/next": "次へ",
  "smarthr-ui/Pagination/page": "ページ",
  "smarthr-ui/Pagination/total": "全",
  "smarthr-ui/Pagination/items": "件",
  "smarthr-ui/DropdownMenuButton/triggerInactive": "候補を開く",
  "smarthr-ui/DropdownMenuButton/triggerActive": "候補を閉じる",
}

export const IntlProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactIntlProvider messages={messages} locale="ja">
      {children}
    </ReactIntlProvider>
  )
} 