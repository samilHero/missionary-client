'use client';

import { ModalDispatchContext } from '@context/ModalDispatchContext';
import { useContext } from 'react';

export const useModal = () => useContext(ModalDispatchContext);
