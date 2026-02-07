import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { missionaryApi } from 'apis/missionary';
import { vi } from 'vitest';

import { useMissionaries } from '../useMissionaries';

import type { ReactNode } from 'react';

vi.mock('apis/missionary', () => ({
  missionaryApi: {
    getMissionaries: vi.fn(),
  },
}));

describe('useMissionaries', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch missionaries successfully', async () => {
    const mockMissionaries = [
      {
        id: '1',
        name: '2024 제주선교',
        startDate: '2024-07-01',
        endDate: '2024-07-07',
        participationStartDate: '2024-06-01',
        participationEndDate: '2024-06-25',
        regionId: 'region-1',
        status: 'RECRUITING',
      },
      {
        id: '2',
        name: '2024 부산선교',
        startDate: '2024-08-01',
        endDate: '2024-08-07',
        participationStartDate: '2024-07-01',
        participationEndDate: '2024-07-25',
        regionId: 'region-2',
        status: 'RECRUITING',
      },
    ];

    vi.mocked(missionaryApi.getMissionaries).mockResolvedValue({
      data: mockMissionaries,
    } as any);

    const { result } = renderHook(() => useMissionaries(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMissionaries);
    expect(missionaryApi.getMissionaries).toHaveBeenCalledTimes(1);
  });

  it('should handle error', async () => {
    const error = new Error('Failed to fetch missionaries');
    vi.mocked(missionaryApi.getMissionaries).mockRejectedValue(error);

    const { result } = renderHook(() => useMissionaries(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
