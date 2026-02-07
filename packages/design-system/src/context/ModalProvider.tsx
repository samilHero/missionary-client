'use client';

import { Modals } from '@components/modal/Modals';
import { useMemo, useState, type ReactNode, type ComponentProps } from 'react';

import { ModalDispatchContext } from './ModalDispatchContext';
import { ModalStateContext } from './ModalStateContext';

import type { ModalArray } from './ModalStateContext';

interface ModalProviderType {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderType) => {
  const [openedModals, setOpenedModals] = useState<ModalArray>([]);

  const openModal = <T extends React.ElementType>(
    Component: T,
    props: ComponentProps<T>,
  ) => {
    setOpenedModals((modals) => {
      const isAlreadyOpen = modals.some(
        (modal) => modal.Component === Component,
      );
      return isAlreadyOpen
        ? modals
        : [...modals, { Component, props, opened: true }];
    });
  };

  const closeModal = <T extends React.ElementType>(Component: T) => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => {
        return modal.Component !== Component;
      });
    });
  };

  const dispatch = useMemo(() => {
    return { openModal, closeModal };
  }, [openModal, closeModal]);

  return (
    <ModalStateContext.Provider value={openedModals}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
        <Modals />
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};
