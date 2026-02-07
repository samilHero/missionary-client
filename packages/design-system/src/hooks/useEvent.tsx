'use client';

import React from 'react';

import { useLatestValue } from './useLatestValue';

export const useEvent =
  // TODO: Add React.useEvent ?? once the useEvent hook is available
  function useEvent<
    F extends (...args: any[]) => any,
    P extends any[] = Parameters<F>,
    R = ReturnType<F>,
  >(fn: (...args: P) => R) {
    const cache = useLatestValue(fn);
    return React.useCallback((...args: P) => cache.current(...args), [cache]);
  };
