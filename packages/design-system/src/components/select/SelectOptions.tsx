import { useContextData } from '@hooks';
import React from 'react';

import { SelectDataContext } from './index';

import type { HTMLProps } from 'react';

export interface SelectOptionsProps extends HTMLProps<HTMLUListElement> {
  label?: string;
  ref?: React.Ref<HTMLUListElement>;
}
export const SelectOptions = ({
  children,
  label,
  className,
  ref,
  ...props
}: SelectOptionsProps) => {
  const data = useContextData('Select.Options', SelectDataContext);

  return (
    data.open && (
      <ul ref={ref} className={className} {...props}>
        {label && <div>{label}</div>}
        {children}
      </ul>
    )
  );
};
