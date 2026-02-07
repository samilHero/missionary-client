'use client';

import classnames from 'classnames';
import React, { useId } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerStyles.css';

export interface DatePickerProps {
  label?: string;
  hideLabel?: boolean;
  error?: string;
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  ref?: React.Ref<HTMLInputElement>;
  // Range & Common props
  startDate?: Date | null;
  endDate?: Date | null;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  dateFormat?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  timeCaption?: string;
  isClearable?: boolean;
  [key: string]: any;
}

export function DatePicker({
  label,
  hideLabel = false,
  error,
  selected,
  onChange,
  placeholder,
  disabled,
  className,
  id: providedId,
  ref,
  ...rest
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={classnames('relative flex flex-col', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={classnames(
            'mb-1 text-xs font-normal leading-[1.833] text-gray-70',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>
      )}
      <div
        className={classnames(
          'flex h-12 items-center gap-2.5 pt-[14px] pb-[14px] pl-4 pr-4 rounded-lg',
          disabled ? 'bg-gray-05' : 'bg-gray-02',
        )}
      >
        <ReactDatePicker
          id={inputId}
          selected={selected}
          onChange={onChange as any}
          placeholderText={placeholder}
          disabled={disabled}
          className="w-full border-0 bg-transparent text-black text-sm leading-[1.428] focus:outline-none placeholder:text-gray-30 disabled:text-primary-30"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          customInputRef={ref as any}
          autoComplete="off"
          dateFormat="yyyy-MM-dd"
          {...rest}
        />
      </div>
      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-1 text-error-60 text-xs leading-[1.5]"
        >
          {error}
        </div>
      )}
    </div>
  );
}
DatePicker.displayName = 'DatePicker';
