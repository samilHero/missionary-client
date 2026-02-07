import '@styles/tailwind.css';
import '@styles/_global.scss';
import type { Metadata } from 'next';

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ko">
    <body>
      <main>{children}</main>
    </body>
  </html>
);

export default RootLayout;

export const metadata: Metadata = {
  title: '선교 어플리케이션',
};
