import type { Context } from 'react';
import { useContext } from 'react';

// 제네릭 타입 T를 사용하여, 어떤 타입의 컨텍스트든 처리할 수 있도록 합니다.
// component 매개변수는 컴포넌트 이름을 나타내며, 오류 메시지에 사용됩니다.
// actionContext 매개변수는 React의 Context 객체입니다.
export const useContextAction = <T>(
  component: string,
  actionContext: Context<T | null>,
) => {
  const context = useContext(actionContext);

  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent component that provides a ${actionContext.displayName || 'specified'} context.`,
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, useContextAction);
    }
    throw err;
  }

  return context;
};

export type ContextAction<T> = ReturnType<typeof useContextAction<T>>;
