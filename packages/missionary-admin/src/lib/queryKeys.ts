export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  missionaries: {
    all: ['missionaries'] as const,
    list: () => [...queryKeys.missionaries.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.missionaries.all, 'detail', id] as const,
  },
  regions: {
    all: ['regions'] as const,
    list: () => [...queryKeys.regions.all, 'list'] as const,
  },
} as const;
