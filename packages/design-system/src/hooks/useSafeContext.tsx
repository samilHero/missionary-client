'use client';

import { useContext } from 'react';

import type { Context } from 'react';

export const useSafeContext = <T,>(context: Context<T>): NonNullable<T> => {
  const value = useContext(context);
  if (value === undefined || value === null) {
    const contextName = context.displayName || JSON.stringify(context, null, 2);
    const err = new Error(
      `${contextName}.Provider 태그 내부에서 useSafeContext 사용해주세요.`,
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, useSafeContext);
    }
    throw err;
  }

  return value;
};
