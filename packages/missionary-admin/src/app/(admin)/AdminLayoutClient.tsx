'use client';

import {
  AsyncBoundary,
  AuthErrorFallback,
  AuthLoadingFallback,
} from 'components/boundary';
import { Header } from 'components/header/Header';
import { Sidebar } from 'components/sidebar/Sidebar';
import { AuthProvider } from 'lib/auth/AuthContext';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AsyncBoundary
      pendingFallback={<AuthLoadingFallback />}
      rejectedFallback={AuthErrorFallback}
    >
      <AuthProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1 ml-[260px] bg-primary-10">
            <Header />
            <main className="flex-1 p-[40px_60px]">{children}</main>
          </div>
        </div>
      </AuthProvider>
    </AsyncBoundary>
  );
}
