'use client';

import classnames from 'classnames';
import React from 'react';

export interface NavItemProps {
  label: string;
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
  isActive?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function NavItem({
  label,
  href,
  onClick,
  isActive,
  isExpanded,
  hasChildren,
  depth = 0,
  className,
  style,
}: NavItemProps) {
  const isParent = depth === 0;

  const baseClasses =
    'flex items-center justify-between w-full transition-colors duration-200 cursor-pointer text-left font-medium text-[15px] leading-[22px]';

  const parentClasses = classnames(
    'h-[55px] px-[20px] text-white border-b border-gray-05 hover:bg-white/5',
    {
      'bg-white/5': isActive,
    },
  );

  const childClasses = classnames(
    'h-[55px] px-[24px] bg-secondary-10 text-primary-80 hover:bg-white/12',
    {
      'bg-white/12': isActive,
    },
  );

  const classes = classnames(
    baseClasses,
    isParent ? parentClasses : childClasses,
    className,
  );

  const content = (
    <>
      <span className="flex-1 truncate">{label}</span>
      {hasChildren && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classnames('transition-transform duration-200', {
            'rotate-180': isExpanded,
          })}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} style={style} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} style={style}>
      {content}
    </button>
  );
}
