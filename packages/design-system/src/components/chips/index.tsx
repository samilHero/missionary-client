'use client';

import classnames from 'classnames';

import type { ReactNode } from 'react';

interface ChipsProps {
  children: ReactNode;
  className?: string;
}

export function Chips({ children, className }: ChipsProps) {
  return (
    <span
      className={classnames(
        'inline-flex items-center px-3 py-1.5 rounded-2xl bg-gray-05 text-black text-sm leading-[1.429] whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  );
}
Chips.displayName = 'Chips';
