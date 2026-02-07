import { useContextData } from '@hooks';
import React, { useEffect } from 'react';

import { SelectDataContext } from './index';

import type { InputHTMLAttributes } from 'react';

export interface SelectSearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  placeholder: string;
  onChange?: (value: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}
export const SelectSearchInput = ({
  value,
  onChange,
  placeholder,
  className,
  ref,
  ...props
}: SelectSearchInputProps) => {
  const data = useContextData('Select.SearchInput', SelectDataContext);

  useEffect(() => {
    return () => {
      onChange?.('');
    };
  }, [onChange]);

  useEffect(() => {
    const inputRef = ref as React.RefObject<HTMLInputElement>;
    if (inputRef?.current) {
      inputRef.current?.focus();
    }

    return () => {
      if (inputRef?.current) {
        inputRef.current.blur();
      }
    };
  }, []);

  return (
    data.open && (
      <input
        ref={ref}
        value={value}
        placeholder={placeholder}
        className={className}
        onChange={(e) => {
          onChange?.(e.target.value.toLowerCase(), e);
        }}
        {...props}
      />
    )
  );
};
