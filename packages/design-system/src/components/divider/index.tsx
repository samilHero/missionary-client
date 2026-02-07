'use client';

import classnames from 'classnames';

interface DividerProps {
  height?: 4 | 10 | 12 | 24;
  className?: string;
}

const heightClasses: Record<number, string> = {
  4: 'h-1',
  10: 'h-2.5',
  12: 'h-3',
  24: 'h-6',
};

export function Divider({ height = 4, className }: DividerProps) {
  return (
    <div
      className={classnames(
        'w-full bg-gray-05',
        heightClasses[height],
        className,
      )}
    />
  );
}
Divider.displayName = 'Divider';
