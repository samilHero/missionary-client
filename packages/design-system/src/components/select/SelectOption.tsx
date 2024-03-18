import type { HTMLAttributes, Ref } from 'react';
import React from 'react';
import { useContextAction } from '@hooks';
import { SelectActionsContext } from './index';

interface SelectOptionProps extends HTMLAttributes<HTMLLIElement> {
  item: string;
}
export const SelectOption = (
  { item, className, children, ...props }: SelectOptionProps,
  ref: Ref<HTMLLIElement>,
) => {
  const actions = useContextAction('Select.Option', SelectActionsContext);

  return (
    <li
      ref={ref}
      className={className}
      onClick={() => {
        actions.handleSelectItem(item);
      }}
      {...props}
    >
      {children}
    </li>
  );
};
