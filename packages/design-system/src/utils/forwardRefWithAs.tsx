import { forwardRef } from 'react';

export const forwardRefWithAs = <
  T extends { name: string; displayName?: string },
>(
  component: T,
): T & { displayName: string } =>
  Object.assign(forwardRef(component as unknown as any) as any, {
    displayName: component.displayName ?? component.name,
  });
