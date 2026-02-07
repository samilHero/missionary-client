'use client';

import { Button } from '@samilhero/design-system';
import { useEffect } from 'react';
import Modal from 'react-modal';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  missionaryName: string;
  isPending?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  missionaryName,
  isPending = false,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#__next');
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="선교 삭제 확인"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold text-gray-90 mb-4">선교 삭제</h2>
        <p className="text-base text-gray-70 mb-6">
          정말 '{missionaryName}' 선교를 삭제하시겠습니까?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            color="secondary"
            size="md"
            onClick={onCancel}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            variant="filled"
            color="primary"
            size="md"
            onClick={onConfirm}
            disabled={isPending}
          >
            삭제
          </Button>
        </div>
      </div>
    </Modal>
  );
}
