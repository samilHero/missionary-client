'use client';

import { ThemeProvider } from '@emotion/react';

import { GlobalStyle } from '@/styles/Global';

import { theme } from '../styles/theme';

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
