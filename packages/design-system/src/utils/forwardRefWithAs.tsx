import { forwardRef } from 'react';

/**
 * This is a hack, but basically we want to keep the full 'API' of the component, but we do want to
 * wrap it in a forwardRef so that we _can_ passthrough the ref
 * [래퍼런스 코드](https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/utils/render.ts)
 */

export const forwardRefWithAs = <
  T extends { name: string; displayName?: string },
>(
  component: T,
): T & { displayName: string } =>
  Object.assign(forwardRef(component as unknown as never) as never, {
    displayName: component.displayName ?? component.name,
  });
