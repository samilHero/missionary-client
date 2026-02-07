'use client';

import classnames from 'classnames';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PAGE_GROUP_SIZE = 5;

function getPageGroup(currentPage: number, totalPages: number): number[] {
  const groupIndex = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE);
  const start = groupIndex * PAGE_GROUP_SIZE + 1;
  const end = Math.min(start + PAGE_GROUP_SIZE - 1, totalPages);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = getPageGroup(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const navButtonClass =
    'flex items-center justify-center w-8 h-8 p-0 border-0 rounded bg-transparent cursor-pointer text-gray-30 hover:bg-gray-02 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent';
  const pageNumberClass = (active: boolean) =>
    classnames(
      'flex items-center justify-center w-8 h-8 p-0 border-0 rounded bg-transparent text-sm leading-[1.429] cursor-pointer hover:bg-gray-02',
      active ? 'text-black font-bold' : 'text-gray-30 font-normal',
    );

  return (
    <nav
      className={classnames('flex items-center gap-1', className)}
      aria-label="페이지 네비게이션"
    >
      <button
        type="button"
        className={navButtonClass}
        disabled={!hasPrev}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 4L6 8L10 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={pageNumberClass(page === currentPage)}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={navButtonClass}
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}
Pagination.displayName = 'Pagination';
