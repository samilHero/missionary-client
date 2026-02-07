'use client';

import { IconInputError, IconInputReset } from '@assets/icons';
import classnames from 'classnames';
import React from 'react';

import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType?: string;
  disabled?: boolean;
  value: string;
  error?: string;
  onClick?: () => void;
  onReset?: () => void;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  inputType = 'text',
  disabled,
  value,
  error,
  onChange,
  onClick,
  onReset,
  ref,
  className,
  ...rest
}: InputProps) {
  return (
    <div className={classnames('flex flex-col', className)}>
      <div className="flex w-80 h-5 px-4 py-[13px] rounded-lg bg-gray-02 text-black">
        <input
          type={inputType}
          disabled={disabled}
          autoComplete="off"
          value={value}
          onChange={onChange}
          onClick={onClick}
          ref={ref}
          className="flex-1 border-0 bg-gray-02 focus:outline-none placeholder:text-gray-30 disabled:bg-gray-05 disabled:text-primary-30"
          {...rest}
        />
        {error && <IconInputError className="ml-auto" />}
        <IconInputReset
          className="ml-auto cursor-pointer"
          onClick={() => onReset?.()}
        />
      </div>
      {error && <div className="mt-[5px] text-error-60 text-xs">{error}</div>}
    </div>
  );
}
Input.displayName = 'Input';
