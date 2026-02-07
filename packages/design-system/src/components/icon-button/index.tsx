'use client';

import classnames from 'classnames';
import { type ButtonHTMLAttributes } from 'react';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'filled' | 'ghost';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

const squareClasses: Record<IconButtonSize, string> = {
  sm: 'w-8',
  md: 'w-10',
  lg: 'w-12',
};

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent hover:bg-gray-02',
  filled: 'bg-primary-80 text-white hover:bg-primary-60',
};

export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  className,
  style,
  ...props
}: IconButtonProps) {
  const hasLabel = !!label;

  return (
    <button
      className={classnames(
        'rounded-lg flex items-center justify-center transition-colors',
        sizeClasses[size],
        hasLabel ? 'w-auto px-3 gap-[4px]' : squareClasses[size],
        variantClasses[variant],
        className,
      )}
      style={style}
      {...props}
    >
      {icon}
      {hasLabel && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
