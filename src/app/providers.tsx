"use client"

import { createTheme, ThemeProvider } from "smarthr-ui"

export const Providers = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  const theme = createTheme()
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
