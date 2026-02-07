'use client';

import classnames from 'classnames';
import { type ButtonHTMLAttributes } from 'react';

type ButtonColor = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg';
type ButtonVariant = 'filled' | 'outline';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  width?: React.CSSProperties['width'];
  size?: ButtonSize;
  color?: ButtonColor;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xlg: 'h-[52px]',
  xxlg: 'h-14 rounded-none',
};

const filledColorClasses: Record<ButtonColor, string> = {
  primary:
    'bg-primary-80 text-white hover:bg-primary-60 active:bg-primary-90 disabled:bg-primary-40 disabled:text-primary-20',
  secondary:
    'bg-secondary-50 text-white hover:bg-secondary-40 active:bg-secondary-70 disabled:bg-secondary-20 disabled:text-secondary-30',
};

const outlineClasses =
  'border border-primary-80 bg-white text-primary-80 hover:bg-primary-10 active:bg-primary-20 disabled:border-primary-30 disabled:text-primary-30 disabled:cursor-not-allowed';

export function Button({
  variant = 'filled',
  width,
  size = 'md',
  color = 'primary',
  children,
  className,
  style,
  ...props
}: ButtonProps) {
  const widthStyle =
    typeof width === 'number' ? { width: `${width}px` } : { width };

  return (
    <button
      className={classnames(
        'text-base font-bold rounded-lg',
        sizeClasses[size],
        variant === 'filled' ? filledColorClasses[color] : outlineClasses,
        className,
      )}
      style={{ ...widthStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
