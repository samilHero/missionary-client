import type { HTMLProps, Ref } from 'react';
import React from 'react';
import { useData } from './index';

interface SelectOptionsProps extends HTMLProps<HTMLUListElement> {
  label?: string;
}
export const SelectOptions = (
  { children, label, className, ...props }: SelectOptionsProps,
  ref: Ref<HTMLUListElement>,
) => {
  const data = useData('Select.Options');

  return (
    data.open && (
      <ul ref={ref} className={className} {...props}>
        {label ?? <div>{label}</div>}
        {children}
      </ul>
    )
  );
};
