import type { ButtonHTMLAttributes, Ref } from 'react';
import React, { useCallback } from 'react';
import { useActions } from './index';

interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
export const SelectTrigger = (
  { children, ...props }: TriggerProps,
  ref: Ref<HTMLButtonElement>,
) => {
  const actions = useActions('Select.Trigger');

  const handleOnClick = useCallback(() => {
    actions.setOpen((prevOpen) => !prevOpen);
  }, [actions.setOpen]);

  return (
    <button ref={ref} onClick={handleOnClick} {...props}>
      {children}
    </button>
  );
};
