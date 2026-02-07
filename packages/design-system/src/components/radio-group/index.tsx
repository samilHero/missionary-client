'use client';

// TODO: (주찬) 아직 작업 중인 컴포넌트입니다. [24-05-15]

import { useControllableState } from '@hooks';
import React, { useCallback, useMemo } from 'react';

import {
  RadioGroupActionsContext,
  RadioGroupDataContext,
} from './radioGroupContext';

interface RadioGroupProps extends Omit<
  React.HTMLProps<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'checked' | 'defaultChecked' | 'value'
> {
  defaultCheckedValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export function RadioGroup({
  defaultCheckedValue,
  value: controlledValue,
  onChange: controlledOnChange,
  disabled,
  className,
  children,
  name,
  ref,
  ...props
}: RadioGroupProps) {
  const [value, onChange] = useControllableState<string>(
    controlledValue,
    controlledOnChange,
    defaultCheckedValue,
  );

  const changeValue = useCallback(
    (changedValue: string) => {
      if (disabled) {
        return;
      }
      onChange?.(changedValue);
    },
    [disabled],
  );

  const actions = useMemo(
    () => ({
      changeValue,
    }),
    [changeValue],
  );
  const data = useMemo(
    () => ({
      value,
    }),
    [value],
  );

  return (
    <RadioGroupActionsContext.Provider value={actions}>
      <RadioGroupDataContext.Provider value={data}>
        <div
          role="radiogroup"
          tabIndex={0}
          className={className}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </RadioGroupDataContext.Provider>
    </RadioGroupActionsContext.Provider>
  );
}
RadioGroup.displayName = 'RadioGroup';
