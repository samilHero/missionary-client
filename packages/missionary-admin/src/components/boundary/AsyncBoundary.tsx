'use client';

import { Button } from '@samilhero/design-system';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { type ComponentType, type ReactNode, Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback: ReactNode;
  rejectedFallback?: ComponentType<FallbackProps>;
}

function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-[12px] p-[24px]"
    >
      <h2 className="text-[18px] font-bold text-gray-70 m-0">
        오류가 발생했습니다
      </h2>
      <pre className="text-[14px] text-error-50 m-0">{errorMessage}</pre>
      <Button
        type="button"
        size="sm"
        color="primary"
        onClick={resetErrorBoundary}
      >
        다시 시도
      </Button>
    </div>
  );
}

export function AsyncBoundary({
  children,
  pendingFallback,
  rejectedFallback: RejectedFallback = DefaultErrorFallback,
}: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={RejectedFallback}>
          <Suspense fallback={pendingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
