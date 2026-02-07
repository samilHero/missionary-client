## DatePicker Component Implementation

- **Library**: `react-datepicker` (v7+ includes types, removed `@types/react-datepicker`).
- **Structure**: Wraps `ReactDatePicker` in the same container structure as `InputField` for consistency.
- **Styling**: Used `DatePickerStyles.css` to override `react-datepicker` default styles (calendar, header, day cells) to match design system colors (Tailwind gray/primary palette).
- **Types**:
  - `ReactDatePicker` types in TS can be strict about `onChange` (expecting array for range) and `aria-invalid` (expecting string).
  - Workaround: Cast `onChange` to `any` or explicit `(date: Date | null) => void`.
  - Workaround: Cast `ref` to `any` for `customInputRef`.
- **Props**: Extended props manually (`[key: string]: any`) to allow passing advanced `react-datepicker` props like `minDate`, `maxDate`, `selectsStart`, etc., without strict type checking fighting.
- **Accessibility**: Uses `aria-invalid` (string 'true'/'false'), `aria-describedby` for error messages, and `label` with `htmlFor`.

## API Service + React Query Hooks Implementation (2026-02-07)

### API Service Pattern

- Follow auth.ts pattern: import api from './instance', export object literal with methods
- Define TypeScript interfaces for request/response types
- Use generic types with api methods: `api.get<Type>()`, `api.post<Type>()`
- Payload interfaces: CreateXPayload, UpdateXPayload (Update has all optional fields)
- Response interfaces: include all fields from server DTO + computed fields (createdAt, etc.)

### Query Keys Structure

- Hierarchical structure: `{ all: ['domain'], list: () => [...all, 'list'], detail: (id) => [...all, 'detail', id] }`
- Use `as const` for type safety
- Invalidate at appropriate level: `queryKeys.missionaries.all` invalidates both list and detail queries

### React Query Hook Patterns

**Query Hooks (useQuery):**

- Import: useQuery, api service, queryKeys
- Return useQuery with queryKey and async queryFn
- Extract response.data in queryFn
- Add `enabled: !!id` for detail queries to prevent fetching with undefined id

**Mutation Hooks (useMutation):**

- Import: useMutation, useQueryClient, useRouter (if navigation needed), api service, queryKeys
- Call useQueryClient() and useRouter() at hook level
- Return useMutation with mutationFn and onSuccess
- onSuccess: invalidateQueries + router.push (if needed)
- Invalidate at domain level: `queryClient.invalidateQueries({ queryKey: queryKeys.missionaries.all })`

### Testing Pattern (TDD with Vitest)

- Write tests FIRST before implementation
- Use vi.mock() to mock API modules and next/navigation
- Create QueryClient with retry: false for tests
- Wrap renderHook with QueryClientProvider
- Test files must be .tsx (not .ts) if they contain JSX
- Import ReactNode type for wrapper children prop
- Test mutation success, query invalidation, router navigation, and error handling

### Vitest Configuration for Monorepo

- vitest.config.ts must include path aliases for both design-system (@assets, @components, etc.) and local src directories (apis, hooks, lib, etc.)
- Use simple string aliases, not regex patterns: `{ apis: path.resolve(__dirname, './src/apis') }`
- Matches tsconfig.json baseUrl: "./src" behavior
- Design system aliases must be specific (e.g., '@assets/icons' before '@assets') to avoid conflicts

### File Structure

```
src/
├── apis/
│   ├── missionary.ts (API service + interfaces)
│   └── region.ts
├── hooks/
│   ├── missionary/
│   │   ├── __tests__/
│   │   │   ├── useCreateMissionary.test.tsx
│   │   │   └── useMissionaries.test.tsx
│   │   ├── useMissionaries.ts
│   │   ├── useMissionary.ts
│   │   ├── useCreateMissionary.ts
│   │   ├── useUpdateMissionary.ts
│   │   ├── useDeleteMissionary.ts
│   │   └── index.ts (barrel export)
│   └── region/
│       ├── useRegions.ts
│       └── index.ts
└── lib/
    └── queryKeys.ts (centralized query key factory)
```

### Key Learnings

1. TDD approach: Write tests first, then implement to make tests pass
2. Query key factory pattern enables consistent cache invalidation
3. Barrel exports (index.ts) provide clean import paths
4. Vitest path aliases must match tsconfig baseUrl behavior
5. Test files with JSX must use .tsx extension
6. Mutation hooks should invalidate at domain level (all) to refresh both list and detail queries

## Modal Component Implementation (DeleteConfirmModal)

### Component Structure

- **Location**: `packages/missionary-admin/src/components/missionary/DeleteConfirmModal.tsx`
- **Library**: react-modal for modal functionality
- **Design System Integration**: Uses Button component from @samilhero/design-system

### Key Implementation Details

1. **Modal Setup**:
   - Uses `Modal.setAppElement('#__next')` to set the root element for Next.js
   - Configured with `shouldCloseOnEsc={true}` and `shouldCloseOnOverlayClick={true}`
   - Custom className for styling with Tailwind CSS

2. **Props Interface**:
   - `isOpen: boolean` - Controls modal visibility
   - `onConfirm: () => void` - Callback for delete action
   - `onCancel: () => void` - Callback for cancel action
   - `missionaryName: string` - Name of missionary to delete
   - `isPending?: boolean` - Loading state for buttons

3. **Styling Approach**:
   - Tailwind CSS for modal overlay and content styling
   - Semi-transparent dark background (`bg-black bg-opacity-50`)
   - White content box with rounded corners and shadow
   - Flex layout for button arrangement

4. **Button Integration**:
   - Cancel button: `variant="outline"`, `color="secondary"`
   - Delete button: `variant="filled"`, `color="primary"`
   - Both buttons disabled when `isPending={true}`

### Testing Approach (TDD)

- Test file: `packages/missionary-admin/src/components/missionary/__tests__/DeleteConfirmModal.test.tsx`
- Test cases cover:
  - Modal rendering when `isOpen={true}`
  - Modal not rendering when `isOpen={false}`
  - `onConfirm` callback execution
  - `onCancel` callback execution
  - Missionary name display in message
  - Button disabled state when `isPending={true}`

### Vitest Configuration Challenges

- **Issue**: Design-system's Input component has unresolved `@assets/icons` import in test environment
- **Root Cause**: vite:import-analysis plugin runs before custom alias resolution
- **Attempted Solutions**:
  - Custom vite plugin with `enforce: 'pre'` for early resolution
  - tsconfigPaths plugin for tsconfig.json path resolution
  - Multiple alias configurations in resolve.alias array
  - SVG mock handling
- **Status**: Type-checking passes (pnpm type-check ✓), but vitest test execution blocked by import resolution issue
- **Note**: This is a pre-existing configuration issue not specific to DeleteConfirmModal implementation

### Accessibility Considerations

- Modal has `contentLabel="선교 삭제 확인"` for screen readers
- Buttons have clear labels in Korean
- Escape key closes modal (standard UX pattern)
- Overlay click closes modal (standard UX pattern)

### Dependencies Added

## Task 8 Findings (2026-02-07)

- `useMissionary` hook returns `Missionary` type where `pastorName` is optional (`string | undefined`), but `regionId` is required (`string`).
- Used `|| ''` fallback for optional string fields when setting state.
- `useDeleteMissionary` mutation function takes no arguments (id is captured in closure), so `mutate()` should be called without arguments.
- Fixed import paths in `page.tsx` (Task 7) to use relative/absolute imports compatible with `baseUrl: src`.
- Fixed implicit `any` errors in `page.tsx` by importing `Missionary` type.
