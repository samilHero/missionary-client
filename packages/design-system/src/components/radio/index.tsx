'use client';

import { useControllableState } from '@hooks';
import React, { useContext, createContext, useMemo } from 'react';

import { RadioGroupActionsContext } from '../radio-group/radioGroupContext';

export const RadioActionsContext = createContext<{
  onChange: (checked: boolean) => void;
} | null>(null);
RadioActionsContext.displayName = 'RadioActionsContext';

export const RadioDataContext = createContext<{
  checked: boolean;
} | null>(null);
RadioDataContext.displayName = 'RadioDataContext';

interface RadioProps extends Omit<
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

export function Radio({
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
}: RadioProps) {
  const groupActions = useContext(RadioGroupActionsContext);
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
    onChange?.(true);
    if (value && groupActions) {
      groupActions.changeValue?.(value);
    }
  };

  return (
    <RadioActionsContext.Provider value={actions}>
      <RadioDataContext.Provider value={data}>
        <input
          readOnly
          type="radio"
          role="radio"
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
      </RadioDataContext.Provider>
    </RadioActionsContext.Provider>
  );
}
Radio.displayName = 'Radio';
