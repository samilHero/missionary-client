'use client';

import { render, screen, fireEvent } from '@testing-library/react';

import { DeleteConfirmModal } from '../DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const missionaryName = '테스트 선교';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={missionaryName}
      />,
    );

    expect(
      screen.getByText(/정말 '테스트 선교' 선교를 삭제하시겠습니까?/),
    ).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    const { container } = render(
      <DeleteConfirmModal
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={missionaryName}
      />,
    );

    // Modal should not be visible
    const modalContent = container.querySelector('.ReactModal__Content');
    expect(modalContent).not.toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={missionaryName}
      />,
    );

    const confirmButton = screen.getByRole('button', { name: '삭제' });
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={missionaryName}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: '취소' });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should display missionary name in the message', () => {
    const customName = '특별 선교';
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={customName}
      />,
    );

    expect(
      screen.getByText(/정말 '특별 선교' 선교를 삭제하시겠습니까?/),
    ).toBeInTheDocument();
  });

  it('should disable confirm button when isPending is true', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={missionaryName}
        isPending={true}
      />,
    );

    const confirmButton = screen.getByRole('button', { name: '삭제' });
    expect(confirmButton).toBeDisabled();
  });

  it('should enable confirm button when isPending is false', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={missionaryName}
        isPending={false}
      />,
    );

    const confirmButton = screen.getByRole('button', { name: '삭제' });
    expect(confirmButton).not.toBeDisabled();
  });

  it('should call onCancel when modal is requested to close', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        missionaryName={missionaryName}
      />,
    );

    // Simulate closing modal by pressing Escape or clicking overlay
    const overlay = document.querySelector('.ReactModal__Overlay');
    if (overlay) {
      fireEvent.keyDown(overlay, { key: 'Escape', code: 'Escape' });
    }

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
