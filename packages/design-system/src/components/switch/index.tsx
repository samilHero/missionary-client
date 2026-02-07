'use client';

import { useControllableState } from '@hooks';
import React, { createContext, useMemo } from 'react';

export const SwitchActionsContext = createContext<{
  onChange: (checked: boolean) => void;
} | null>(null);
SwitchActionsContext.displayName = 'SwitchActionsContext';

export const SwitchDataContext = createContext<{
  checked: boolean;
} | null>(null);
SwitchDataContext.displayName = 'SwitchDataContext';

interface SwitchProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  value?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
  focus?: boolean;
}

export function Switch({
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
}: SwitchProps) {
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
  };

  return (
    <SwitchActionsContext.Provider value={actions}>
      <SwitchDataContext.Provider value={data}>
        <input
          readOnly
          type="checkbox"
          role="switch"
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
      </SwitchDataContext.Provider>
    </SwitchActionsContext.Provider>
  );
}
Switch.displayName = 'Switch';
