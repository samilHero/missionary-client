'use client';

import { useControllableState } from '@hooks';
import React, { useContext, createContext, useMemo } from 'react';

import { CheckboxGroupActionsContext } from '../checkbox-group/checkboxGroupContext';

export const CheckboxActionsContext = createContext<{
  onChange: (checked: boolean) => void;
} | null>(null);
CheckboxActionsContext.displayName = 'CheckboxActionsContext';

export const CheckboxDataContext = createContext<{
  checked: boolean;
} | null>(null);
CheckboxDataContext.displayName = 'CheckboxDataContext';

interface CheckboxProps extends Omit<
  React.HTMLProps<HTMLInputElement>,
  'onChange'
> {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  value?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export function Checkbox({
  defaultChecked = false,
  checked: controlledChecked,
  onChange: controlledOnChange,
  value,
  disabled,
  className,
  children,
  name,
  ref,
  ...props
}: CheckboxProps) {
  const groupActions = useContext(CheckboxGroupActionsContext);

  const [checked, onChange] = useControllableState<boolean>(
    controlledChecked,
    controlledOnChange,
    defaultChecked,
  );

  const actions = useMemo(
    () => ({
      onChange,
    }),
    [onChange],
  );
  const data = useMemo(
    () => ({
      checked,
    }),
    [checked],
  );

  const handleClick = () => {
    onChange?.(!checked);
    if (value && groupActions) {
      groupActions.updateCheckedValue?.(value);
    }
  };

  return (
    <CheckboxActionsContext.Provider value={actions}>
      <CheckboxDataContext.Provider value={data}>
        <input
          readOnly
          type="checkbox"
          role="checkbox"
          ref={ref}
          checked={checked}
          value={value}
          disabled={disabled}
          name={name}
          className="hidden"
        />
        <div
          className={className}
          onClick={disabled ? undefined : handleClick}
          {...props}
        >
          {children}
        </div>
      </CheckboxDataContext.Provider>
    </CheckboxActionsContext.Provider>
  );
}
Checkbox.displayName = 'Checkbox';
