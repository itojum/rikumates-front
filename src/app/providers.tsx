"use client"

import { ThemeProvider } from "smarthr-ui"

export const Providers = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return <ThemeProvider>{children}</ThemeProvider>
}
