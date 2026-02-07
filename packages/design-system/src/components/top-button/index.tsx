'use client';

import classnames from 'classnames';

interface TopButtonProps {
  onClick?: () => void;
  className?: string;
}

export function TopButton({ onClick, className }: TopButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classnames(
        'flex items-center justify-center w-12 h-12 p-0 border border-gray-05 rounded-full bg-white opacity-70 cursor-pointer hover:opacity-100',
        className,
      )}
      aria-label="맨 위로 이동"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5L5 12M12 5L19 12M12 5V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
TopButton.displayName = 'TopButton';
