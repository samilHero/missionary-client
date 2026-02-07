'use client';

import classnames from 'classnames';
import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = ({ text, children, className }: TooltipProps) => {
  return (
    <div
      className={classnames(
        'relative inline-block cursor-pointer group',
        className,
      )}
    >
      {children}
      <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-10 w-max px-2 py-1 rounded text-white text-center opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible bg-gray-70">
        {text}
      </span>
    </div>
  );
};
