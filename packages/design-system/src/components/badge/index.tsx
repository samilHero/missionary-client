'use client';

import classnames from 'classnames';

import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'info';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-10 text-green-50',
  warning: 'bg-error-10 text-error-70',
  info: 'bg-primary-10 text-primary-80',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={classnames(
        'inline-flex items-center px-2 py-1 rounded text-sm font-bold leading-[1.429] whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
Badge.displayName = 'Badge';
