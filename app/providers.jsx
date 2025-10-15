'use client'

import { ThemeProvider } from '../lib/themeContext'

export function Providers({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

