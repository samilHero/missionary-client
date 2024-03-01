import type { Metadata } from 'next';
import { EmotionProvider } from '../lib/EmotionProvider';
export const metadata: Metadata = {
  title: '선교 상륙 작전',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <EmotionProvider>
      <body>
        {children}
      </body>
    </EmotionProvider>
    </html>
  );
}
