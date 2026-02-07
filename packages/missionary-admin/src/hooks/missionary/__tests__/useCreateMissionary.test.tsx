import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { missionaryApi } from 'apis/missionary';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { useCreateMissionary } from '../useCreateMissionary';

import type { ReactNode } from 'react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('apis/missionary', () => ({
  missionaryApi: {
    createMissionary: vi.fn(),
  },
}));

describe('useCreateMissionary', () => {
  let queryClient: QueryClient;
  const mockPush = vi.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should create missionary successfully', async () => {
    const mockMissionary = {
      id: '1',
      name: '2024 제주선교',
      startDate: '2024-07-01',
      endDate: '2024-07-07',
      participationStartDate: '2024-06-01',
      participationEndDate: '2024-06-25',
      regionId: 'region-1',
    };

    vi.mocked(missionaryApi.createMissionary).mockResolvedValue({
      data: mockMissionary,
    } as any);

    const { result } = renderHook(() => useCreateMissionary(), { wrapper });

    result.current.mutate({
      name: '2024 제주선교',
      startDate: '2024-07-01',
      endDate: '2024-07-07',
      participationStartDate: '2024-06-01',
      participationEndDate: '2024-06-25',
      regionId: 'region-1',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(missionaryApi.createMissionary).toHaveBeenCalledWith({
      name: '2024 제주선교',
      startDate: '2024-07-01',
      endDate: '2024-07-07',
      participationStartDate: '2024-06-01',
      participationEndDate: '2024-06-25',
      regionId: 'region-1',
    });
  });

  it('should invalidate queries and navigate on success', async () => {
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    vi.mocked(missionaryApi.createMissionary).mockResolvedValue({
      data: {},
    } as any);

    const { result } = renderHook(() => useCreateMissionary(), { wrapper });

    result.current.mutate({
      name: '2024 제주선교',
      startDate: '2024-07-01',
      endDate: '2024-07-07',
      participationStartDate: '2024-06-01',
      participationEndDate: '2024-06-25',
      regionId: 'region-1',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['missionaries'],
    });
    expect(mockPush).toHaveBeenCalledWith('/missions');
  });

  it('should handle error', async () => {
    const error = new Error('Failed to create missionary');
    vi.mocked(missionaryApi.createMissionary).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateMissionary(), { wrapper });

    result.current.mutate({
      name: '2024 제주선교',
      startDate: '2024-07-01',
      endDate: '2024-07-07',
      participationStartDate: '2024-06-01',
      participationEndDate: '2024-06-25',
      regionId: 'region-1',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
