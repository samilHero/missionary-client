'use client';

import { ModalDispatchContext } from '@context/ModalDispatchContext';
import { ModalStateContext } from '@context/ModalStateContext';
import { useContext } from 'react';

export const Modals = () => {
  const openedModals = useContext(ModalStateContext);
  const { closeModal } = useContext(ModalDispatchContext);

  if (openedModals.length === 0) {
    return null;
  }

  return openedModals.map((modal, index) => {
    const { Component, props } = modal;

    const { onSubmit, ...restProps } = props;

    const handleCloseModal = () => {
      closeModal(Component);
    };

    const handleSubmit = async () => {
      if (typeof onSubmit === 'function') {
        await onSubmit();
      }
      handleCloseModal();
    };

    return (
      <Component
        key={index}
        closeModal={handleCloseModal}
        onSubmit={handleSubmit}
        {...restProps}
      />
    );
  });
};
