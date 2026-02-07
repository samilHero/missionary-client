'use client';

import { createContext } from 'react';

import type { ComponentProps } from 'react';

export interface ModalDispatchContextType {
  openModal: <T extends React.ElementType>(
    Component: T,
    props: ComponentProps<T>,
  ) => void;
  closeModal: <T extends React.ElementType>(Component: T) => void;
}

export const ModalDispatchContext = createContext<ModalDispatchContextType>({
  openModal: () => {
    return;
  },
  closeModal: () => {
    return;
  },
});
