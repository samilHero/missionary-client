import { useContextAction } from '@hooks';
import React from 'react';

import { SelectActionsContext } from './index';

import type { HTMLAttributes } from 'react';

export interface SelectOptionProps extends HTMLAttributes<HTMLLIElement> {
  item: string;
  ref?: React.Ref<HTMLLIElement>;
}
export const SelectOption = ({
  item,
  className,
  children,
  ref,
  ...props
}: SelectOptionProps) => {
  const actions = useContextAction('Select.Option', SelectActionsContext);

  return (
    <li
      ref={ref}
      className={className}
      onClick={() => {
        actions.handleSelectValue(item);
      }}
      {...props}
    >
      {children}
    </li>
  );
};
