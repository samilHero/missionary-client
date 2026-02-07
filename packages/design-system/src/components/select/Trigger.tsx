import { useContextAction } from '@hooks';
import React, { useCallback } from 'react';

import { SelectActionsContext } from './index';

import type { ButtonHTMLAttributes } from 'react';

export interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}
export const SelectTrigger = ({ children, ref, ...props }: TriggerProps) => {
  const actions = useContextAction('Select.Trigger', SelectActionsContext);

  const handleOnClick = useCallback(() => {
    actions.setOpen((prevOpen) => !prevOpen);
  }, [actions.setOpen]);

  return (
    <button ref={ref} onClick={handleOnClick} {...props}>
      {children}
    </button>
  );
};
