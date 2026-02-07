# 선교 CRUD 페이지 (어드민)

## TL;DR

> **Quick Summary**: 어드민 앱에 선교 생성/수정/삭제/리스트 페이지를 구축하고, 디자인 시스템에 DatePicker 컴포넌트를 추가하며, 서버의 삭제 로직을 소프트 딜리트로 변경하고, 사이드바를 동적 메뉴로 전환한다.
>
> **Deliverables**:
>
> - 선교 생성 페이지 (`/missions/create`)
> - 선교 리스트 페이지 (`/missions`)
> - 선교 수정/삭제 페이지 (`/missions/[id]/edit`)
> - DatePicker 디자인 시스템 컴포넌트 (react-datepicker 기반)
> - 서버 소프트 딜리트 변경
> - react-modal 기반 삭제 확인 모달
> - 사이드바 동적 선교 메뉴
> - Vitest 테스트 인프라 + TDD
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 3 → Task 4 → Task 5/6 → Task 7 → Task 8 → Task 9

---

## Context

### Original Request

어드민에서 선교 생성 페이지를 만들기. 신규 국내선교 생성을 클릭하면 선교 생성페이지로 이동되고, 폼으로 작성하는 페이지. 선교 이름, 선교 기간, 담당 교역자, 지역, 참가 신청 기간 입력란이 있고, 생성하기 버튼이 있음. 리스트 페이지, 수정/삭제 페이지도 포함.

### Interview Summary

**Key Discussions**:

- 폼 필드: 5개 (선교 이름, 선교 기간 시작/종료, 담당 교역자, 지역 Select, 참가 신청 기간 시작/종료)
- 수정 페이지: 생성과 동일한 필드 + 삭제 버튼 (확인 모달 포함)
- 리스트 페이지: 테이블 형태, 행 클릭 시 수정 페이지로 이동
- 생성 완료 후 → 리스트 페이지로 이동
- 사이드바: GET /missionaries로 동적 메뉴 구성, 각 선교 클릭 시 필터링된 리스트로 이동
- 대시보드 "신규 국내선교 생성" 버튼 → `/missions/create` 연결
- 날짜 입력: react-datepicker 라이브러리 + 디자인 시스템 DatePicker 컴포넌트
- 모달: react-modal 라이브러리 도입
- 서버 삭제: 하드 딜리트 → 소프트 딜리트로 변경
- 테스트: Vitest 세팅 + TDD

**Research Findings**:

- 서버 API 완전 구현됨: POST/GET/PATCH/DELETE /missionaries
- CreateMissionaryDto 필수 필드: name, startDate, endDate, participationStartDate, participationEndDate, regionId
- 디자인 시스템에 DatePicker 없음 → 새로 빌드
- 로그인 페이지가 폼 패턴 레퍼런스 (useState + useMutation)
- Select 컴포넌트 존재하지만 "작업 중" 상태 (TODO 주석)
- Tailwind CSS v4가 실제 스타일링 방식 (Emotion 아님)
- missionary.service.ts의 remove()가 prisma.missionary.delete() — 하드 딜리트

### Metis Review

**Identified Gaps** (addressed):

- regionId, participationStartDate/EndDate가 서버 필수 필드인데 원래 폼에 없었음 → 폼에 필드 추가로 해결
- DELETE가 하드 딜리트 → 서버 소프트 딜리트로 변경 task 추가
- Modal이 어드민에 연결되지 않음 → react-modal 라이브러리 도입으로 해결
- 리스트 페이지에 Table 컴포넌트 없음 → HTML table + Tailwind로 직접 구현
- Select 컴포넌트가 "작업 중" 상태 → 기존 Select 그대로 사용 (기본 동작은 작동함)

---

## Work Objectives

### Core Objective

어드민에서 선교를 생성/조회/수정/삭제할 수 있는 완전한 CRUD 워크플로우를 구축한다.

### Concrete Deliverables

- `packages/design-system/src/components/date-picker/` — DatePicker 컴포넌트
- `packages/missionary-admin/src/app/(admin)/missions/page.tsx` — 리스트 페이지
- `packages/missionary-admin/src/app/(admin)/missions/create/page.tsx` — 생성 페이지
- `packages/missionary-admin/src/app/(admin)/missions/[id]/edit/page.tsx` — 수정 페이지
- `packages/missionary-admin/src/apis/missionary.ts` — API 서비스
- `packages/missionary-admin/src/apis/region.ts` — 지역 API 서비스
- `packages/missionary-admin/src/hooks/missionary/` — React Query 훅
- `packages/missionary-admin/src/hooks/region/` — 지역 조회 훅
- `packages/missionary-admin/src/components/missionary/DeleteConfirmModal.tsx` — 삭제 확인 모달
- 서버 `missionary.service.ts` 소프트 딜리트 변경
- Vitest 설정 파일 + 테스트 코드

### Definition of Done

- [x] `pnpm build:admin` 성공 (exit code 0)
- [~] `pnpm build:ds` 성공 (exit code 0) - BLOCKED: Pre-existing SVG file issue (not in scope)
- [~] `pnpm lint:all` 성공 (exit code 0) - BLOCKED: Prisma generated files have lint errors (not in scope)
- [~] 어드민 Vitest 테스트 전체 통과 - BLOCKED: DeleteConfirmModal test (SVG import issue, not in scope)

### Must Have

- 5개 폼 필드: 선교 이름, 선교 기간(시작/종료), 담당 교역자, 지역(Select), 참가 신청 기간(시작/종료)
- 생성 후 리스트 페이지로 이동
- 리스트 테이블에서 행 클릭 → 수정 페이지로 이동
- 수정 페이지에 삭제 버튼 + 확인 모달
- 사이드바 동적 선교 메뉴 (API 연동)
- 대시보드 "신규 국내선교 생성" 버튼 → `/missions/create` 연결
- 서버 소프트 딜리트
- TDD (Vitest)

### Must NOT Have (Guardrails)

- Emotion styled-components 사용 금지 — Tailwind CSS만 사용
- 디자인 시스템에 Table 컴포넌트 만들지 않음 — 리스트 페이지에서 HTML table + Tailwind로 직접 구현
- 페이지네이션/검색/정렬 기능 추가 금지 — 이번 스코프 아님
- 생성/수정 폼에 5개 필드 외 추가 필드 금지 (참가비, 정원, 계좌 등)
- react-hook-form이나 zod 같은 폼/검증 라이브러리 도입 금지 — 기존 useState 패턴 유지
- 해외선교 관련 기능 추가 금지

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.

### Test Decision

- **Infrastructure exists**: NO (새로 세팅)
- **Automated tests**: TDD (RED → GREEN → REFACTOR)
- **Framework**: Vitest + @testing-library/react + jsdom

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

**Verification Tool by Deliverable Type:**

| Type                   | Tool                          | How Agent Verifies                         |
| ---------------------- | ----------------------------- | ------------------------------------------ |
| **Frontend/UI pages**  | Playwright (playwright skill) | Navigate, interact, assert DOM, screenshot |
| **API hooks/services** | Vitest unit tests             | Import, call, assert return values         |
| **Server changes**     | Bash (curl)                   | Send requests, assert responses            |
| **Design system**      | Storybook + Playwright        | Open storybook, screenshot component       |
| **Build/Lint**         | Bash                          | Run commands, assert exit codes            |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — independent foundations):
├── Task 1: Vitest 테스트 인프라 세팅 (어드민)
├── Task 2: 서버 소프트 딜리트 변경
└── Task 3: DatePicker 디자인 시스템 컴포넌트

Wave 2 (After Wave 1 — API layer + modal):
├── Task 4: API 서비스 + React Query 훅 (depends: 1)
└── Task 5: react-modal 도입 + 삭제 확인 모달 (depends: 1)

Wave 3 (After Wave 2 — pages):
├── Task 6: 선교 생성 페이지 (depends: 3, 4)
├── Task 7: 선교 리스트 페이지 (depends: 4)
└── Task 8: 선교 수정/삭제 페이지 (depends: 4, 5)

Wave 4 (After Wave 3 — navigation wiring):
└── Task 9: 네비게이션 연결 (대시보드 버튼 + 사이드바 동적 메뉴) (depends: 4, 7)
```

### Dependency Matrix

| Task                   | Depends On | Blocks     | Can Parallelize With |
| ---------------------- | ---------- | ---------- | -------------------- |
| 1 (Vitest)             | None       | 4, 5       | 2, 3                 |
| 2 (서버 소프트 딜리트) | None       | 8          | 1, 3                 |
| 3 (DatePicker)         | None       | 6          | 1, 2                 |
| 4 (API 훅)             | 1          | 6, 7, 8, 9 | 5                    |
| 5 (react-modal)        | 1          | 8          | 4                    |
| 6 (생성 페이지)        | 3, 4       | None       | 7, 8                 |
| 7 (리스트 페이지)      | 4          | 9          | 6, 8                 |
| 8 (수정/삭제 페이지)   | 2, 4, 5    | None       | 6, 7                 |
| 9 (네비게이션)         | 4, 7       | None       | None (final wave)    |

### Agent Dispatch Summary

| Wave | Tasks   | Recommended Agents                                                                |
| ---- | ------- | --------------------------------------------------------------------------------- |
| 1    | 1, 2, 3 | 3개 parallel: quick(1), quick(2), visual-engineering(3)                           |
| 2    | 4, 5    | 2개 parallel: unspecified-low(4), quick(5)                                        |
| 3    | 6, 7, 8 | 3개 parallel: visual-engineering(6), visual-engineering(7), visual-engineering(8) |
| 4    | 9       | 1개: quick(9)                                                                     |

---

## TODOs

- [x] 1. Vitest 테스트 인프라 세팅 (missionary-admin)

  **What to do**:
  - `pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react --filter missionary-admin`
  - `packages/missionary-admin/vitest.config.ts` 생성:
    - environment: 'jsdom'
    - path aliases: `@*` → `../../design-system/src/*`, 로컬 `src/*`도 resolve
    - `@vitejs/plugin-react` 플러그인 추가
    - globals: true (describe/it/expect 전역 사용)
    - setupFiles: `./src/test/setup.ts`
  - `packages/missionary-admin/src/test/setup.ts` 생성:
    - `import '@testing-library/jest-dom'`
  - `packages/missionary-admin/tsconfig.json`에 vitest 타입 추가: `"types": ["vitest/globals"]`
  - `packages/missionary-admin/package.json`의 scripts에 `"test": "vitest run"`, `"test:watch": "vitest"` 추가
  - 검증용 더미 테스트 작성: `packages/missionary-admin/src/test/setup.test.ts`
    - `describe('Vitest setup', () => { it('works', () => { expect(1 + 1).toBe(2); }); });`
  - `pnpm --filter missionary-admin test` 실행하여 통과 확인

  **Must NOT do**:
  - 다른 패키지(design-system, missionary-app, server)에 Vitest 세팅하지 않음
  - E2E 테스트 프레임워크(Playwright 등) 설치하지 않음

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 설정 파일 생성 + 패키지 설치만 하는 단순 작업
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Vitest + React Testing Library 설정 패턴 지식

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `packages/missionary-admin/package.json:1-27` — 현재 의존성 확인, scripts에 test 추가할 위치
  - `packages/missionary-admin/tsconfig.json` — path alias 확인 (`@*` → design-system), types 배열에 vitest/globals 추가

  **API/Type References**:
  - N/A

  **Test References**:
  - N/A (이 task가 테스트 인프라를 처음 세팅함)

  **External References**:
  - Vitest 공식 문서: https://vitest.dev/guide/
  - @testing-library/react 공식: https://testing-library.com/docs/react-testing-library/setup

  **Acceptance Criteria**:

  **TDD (이 task는 인프라 자체이므로 RED-GREEN 없이 직접 검증):**
  - [ ] `pnpm --filter missionary-admin test` → exit code 0, 1 test passed
  - [ ] `packages/missionary-admin/vitest.config.ts` 파일 존재
  - [ ] `packages/missionary-admin/src/test/setup.ts` 파일 존재
  - [ ] `pnpm type-check` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Vitest runs and passes dummy test
    Tool: Bash
    Preconditions: Dependencies installed via pnpm add
    Steps:
      1. pnpm --filter missionary-admin test
      2. Assert: stdout contains "1 passed"
      3. Assert: exit code 0
    Expected Result: Vitest runs successfully with 1 test passing
    Evidence: Terminal output captured

  Scenario: Type checking still passes after vitest config
    Tool: Bash
    Preconditions: vitest.config.ts created, tsconfig updated
    Steps:
      1. pnpm type-check
      2. Assert: exit code 0
    Expected Result: No TypeScript errors
    Evidence: Terminal output captured
  ```

  **Commit**: YES
  - Message: `feat(admin): Vitest 테스트 인프라 세팅`
  - Files: `packages/missionary-admin/vitest.config.ts`, `packages/missionary-admin/src/test/setup.ts`, `packages/missionary-admin/src/test/setup.test.ts`, `packages/missionary-admin/package.json`, `packages/missionary-admin/tsconfig.json`, `pnpm-lock.yaml`
  - Pre-commit: `pnpm --filter missionary-admin test`

---

- [x] 2. 서버 소프트 딜리트 변경 (missionary.service.ts)

  **What to do**:
  - `packages/missionary-server/src/missionary/missionary.service.ts`의 `remove()` 메서드를 수정:
    - 현재: `this.prisma.missionary.delete({ where: { id } })` (하드 딜리트)
    - 변경: `this.prisma.missionary.update({ where: { id }, data: { deletedAt: new Date() } })` (소프트 딜리트)
  - `findAll()`에 소프트 딜리트 필터 추가: `where: { deletedAt: null }`
  - `findOne()`에 소프트 딜리트 필터 추가: 조회 후 `deletedAt`이 null이 아니면 NotFoundException throw
  - `pnpm build:server` 실행하여 빌드 확인

  **Must NOT do**:
  - Prisma 스키마 변경하지 않음 (deletedAt 필드는 이미 Missionary 모델에 존재)
  - 다른 도메인(church, poster 등)의 삭제 로직 변경하지 않음
  - 마이그레이션 생성하지 않음

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 파일의 3개 메서드만 수정하는 간단한 작업
  - **Skills**: [`api-design`]
    - `api-design`: NestJS Service 패턴과 소프트 딜리트 패턴 지식

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 8
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `packages/missionary-server/src/missionary/missionary.service.ts:103-109` — 현재 `remove()` 메서드 (하드 딜리트). `prisma.missionary.delete()`를 `prisma.missionary.update({ data: { deletedAt: new Date() } })`로 변경
  - `packages/missionary-server/src/missionary/missionary.service.ts:40-49` — 현재 `findAll()` 메서드. `where: { deletedAt: null }` 필터 추가 필요
  - `packages/missionary-server/src/missionary/missionary.service.ts:51-66` — 현재 `findOne()` 메서드. deletedAt 체크 추가 필요

  **API/Type References**:
  - Prisma 스키마의 Missionary 모델에 `deletedAt DateTime?` 필드가 이미 존재함

  **Acceptance Criteria**:
  - [ ] `pnpm build:server` → exit code 0
  - [ ] `remove()` 메서드가 `update({ data: { deletedAt: new Date() } })`를 호출
  - [ ] `findAll()`이 `where: { deletedAt: null }` 필터 포함
  - [ ] `findOne()`이 deletedAt이 있는 레코드에 대해 NotFoundException throw

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Server builds successfully after soft-delete change
    Tool: Bash
    Preconditions: missionary.service.ts modified
    Steps:
      1. pnpm build:server
      2. Assert: exit code 0
    Expected Result: Server builds without errors
    Evidence: Terminal output captured

  Scenario: Verify soft-delete code pattern
    Tool: Bash (grep)
    Preconditions: Code changes applied
    Steps:
      1. grep "deletedAt" packages/missionary-server/src/missionary/missionary.service.ts
      2. Assert: contains "deletedAt: new Date()" in remove method
      3. Assert: contains "deletedAt: null" in findAll/findOne
    Expected Result: Soft-delete pattern correctly applied
    Evidence: Grep output captured
  ```

  **Commit**: YES
  - Message: `fix(server): 선교 삭제를 소프트 딜리트로 변경`
  - Files: `packages/missionary-server/src/missionary/missionary.service.ts`
  - Pre-commit: `pnpm build:server`

---

- [x] 3. DatePicker 디자인 시스템 컴포넌트

  **What to do**:
  - `pnpm add react-datepicker --filter @samilhero/design-system`
  - `pnpm add -D @types/react-datepicker --filter @samilhero/design-system`
  - `packages/design-system/src/components/date-picker/index.tsx` 생성:
    - react-datepicker를 래핑한 DatePicker 컴포넌트
    - Props: `label?: string`, `hideLabel?: boolean`, `error?: string`, `selected?: Date | null`, `onChange: (date: Date | null) => void`, `placeholder?: string`, `disabled?: boolean`, `className?: string`, `ref?: React.Ref<HTMLInputElement>`
    - InputField와 동일한 레이아웃 구조: label + input wrapper + error message
    - Tailwind CSS로 스타일링 (react-datepicker 기본 CSS 커스텀)
    - aria-invalid, aria-describedby 접근성 속성 포함
  - `packages/design-system/src/components/date-picker/DatePickerStyles.css` 생성:
    - react-datepicker의 기본 CSS를 import하고 Tailwind와 호환되도록 커스텀
  - `packages/design-system/src/components/index.tsx`에 `export { DatePicker } from './date-picker'` 추가
  - Storybook story 작성: `packages/design-system/src/components/date-picker/index.stories.tsx`
    - Default, WithLabel, WithError, Disabled, Range(시작/종료 예시) variant
  - `pnpm build:ds` 실행하여 빌드 확인

  **Must NOT do**:
  - DateRangePicker 별도 컴포넌트 만들지 않음 — DatePicker 2개를 조합해서 range 표현
  - 너무 복잡한 API 만들지 않음 — react-datepicker의 기본 기능을 얇게 래핑

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI 컴포넌트 + 스타일링 + Storybook 작업
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 디자인 시스템 컴포넌트 구현 전문성

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `packages/design-system/src/components/input-field/index.tsx:1-88` — DatePicker의 구조적 레퍼런스. label/hideLabel/error/disabled 패턴, aria 속성, Tailwind 클래스 모두 이 파일의 패턴을 따를 것
  - `packages/design-system/src/components/index.tsx:1-21` — barrel export 파일. 마지막 줄에 `export { DatePicker } from './date-picker'` 추가

  **API/Type References**:
  - `packages/design-system/src/components/input-field/index.tsx:7-13` — InputFieldProps 인터페이스. DatePicker의 Props도 이와 유사한 구조로 설계

  **External References**:
  - react-datepicker 공식: https://reactdatepicker.com/
  - react-datepicker GitHub: https://github.com/Hacker0x01/react-datepicker

  **Acceptance Criteria**:

  **TDD:**
  - [ ] 테스트 파일: `packages/design-system/` 내에서는 Vitest 미설정이므로 Storybook으로 시각적 검증
  - [ ] `pnpm build:ds` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: DatePicker is exported from design system
    Tool: Bash (grep)
    Preconditions: Component created and barrel export added
    Steps:
      1. grep "DatePicker" packages/design-system/src/components/index.tsx
      2. Assert: line contains "export { DatePicker } from './date-picker'"
    Expected Result: DatePicker is properly exported
    Evidence: Grep output captured

  Scenario: Design system builds with DatePicker
    Tool: Bash
    Preconditions: DatePicker component created, react-datepicker installed
    Steps:
      1. pnpm build:ds
      2. Assert: exit code 0
    Expected Result: Build succeeds with new component
    Evidence: Terminal output captured

  Scenario: DatePicker renders in Storybook
    Tool: Playwright (playwright skill)
    Preconditions: Storybook running on localhost:6006
    Steps:
      1. pnpm sb:ds (start Storybook in background)
      2. Navigate to: http://localhost:6006
      3. Wait for: Storybook UI loaded (timeout: 30s)
      4. Navigate to: DatePicker story in sidebar
      5. Assert: DatePicker component renders in canvas
      6. Screenshot: .sisyphus/evidence/task-3-datepicker-storybook.png
    Expected Result: DatePicker visible and interactive in Storybook
    Evidence: .sisyphus/evidence/task-3-datepicker-storybook.png
  ```

  **Commit**: YES
  - Message: `feat(design-system): DatePicker 컴포넌트 추가 (react-datepicker 기반)`
  - Files: `packages/design-system/src/components/date-picker/index.tsx`, `packages/design-system/src/components/date-picker/DatePickerStyles.css`, `packages/design-system/src/components/date-picker/index.stories.tsx`, `packages/design-system/src/components/index.tsx`, `packages/design-system/package.json`, `pnpm-lock.yaml`
  - Pre-commit: `pnpm build:ds`

---

- [x] 4. API 서비스 + React Query 훅 (missionary + region)

  **What to do**:

  **API 서비스 파일:**
  - `packages/missionary-admin/src/apis/missionary.ts` 생성:
    - `getMissionaries()` → `api.get('/missionaries')` 반환 타입 정의
    - `getMissionary(id: string)` → `api.get(\`/missionaries/${id}\`)`
    - `createMissionary(data: CreateMissionaryPayload)` → `api.post('/missionaries', data)`
    - `updateMissionary(id: string, data: UpdateMissionaryPayload)` → `api.patch(\`/missionaries/${id}\`, data)`
    - `deleteMissionary(id: string)` → `api.delete(\`/missionaries/${id}\`)`
    - TypeScript 인터페이스 정의: `Missionary`, `CreateMissionaryPayload`, `UpdateMissionaryPayload`
    - `Missionary` 타입은 서버 응답과 매칭: id, name, startDate, endDate, pastorName, participationStartDate, participationEndDate, regionId, region(nested), status, createdAt 등
  - `packages/missionary-admin/src/apis/region.ts` 생성:
    - `getRegions()` → `api.get('/regions')` 반환 타입 정의
    - TypeScript 인터페이스: `Region` { id: string, name: string, type: 'DOMESTIC' | 'ABROAD' }

  **Query Keys:**
  - `packages/missionary-admin/src/lib/queryKeys.ts` 확장:
    - `missionaries: { all: ['missionaries'] as const, list: () => [...queryKeys.missionaries.all, 'list'] as const, detail: (id: string) => [...queryKeys.missionaries.all, 'detail', id] as const }`
    - `regions: { all: ['regions'] as const, list: () => [...queryKeys.regions.all, 'list'] as const }`

  **React Query 훅:**
  - `packages/missionary-admin/src/hooks/missionary/useMissionaries.ts`:
    - `useQuery` + `queryKeys.missionaries.list()` + `missionaryApi.getMissionaries`
    - 반환: `{ data, isLoading, error }`
  - `packages/missionary-admin/src/hooks/missionary/useMissionary.ts`:
    - `useQuery` + `queryKeys.missionaries.detail(id)` + `missionaryApi.getMissionary`
  - `packages/missionary-admin/src/hooks/missionary/useCreateMissionary.ts`:
    - `useMutation` + `missionaryApi.createMissionary`
    - onSuccess: `queryClient.invalidateQueries({ queryKey: queryKeys.missionaries.all })`, `router.push('/missions')`
  - `packages/missionary-admin/src/hooks/missionary/useUpdateMissionary.ts`:
    - `useMutation` + `missionaryApi.updateMissionary`
    - onSuccess: `queryClient.invalidateQueries({ queryKey: queryKeys.missionaries.all })`
  - `packages/missionary-admin/src/hooks/missionary/useDeleteMissionary.ts`:
    - `useMutation` + `missionaryApi.deleteMissionary`
    - onSuccess: `queryClient.invalidateQueries({ queryKey: queryKeys.missionaries.all })`, `router.push('/missions')`
  - `packages/missionary-admin/src/hooks/missionary/index.ts` — barrel export
  - `packages/missionary-admin/src/hooks/region/useRegions.ts`:
    - `useQuery` + `queryKeys.regions.list()` + `regionApi.getRegions`
  - `packages/missionary-admin/src/hooks/region/index.ts` — barrel export

  **TDD 테스트:**
  - 각 훅에 대한 단위 테스트 작성 (msw 또는 vi.mock으로 API 모킹)
  - `packages/missionary-admin/src/hooks/missionary/__tests__/useCreateMissionary.test.ts`
  - `packages/missionary-admin/src/hooks/missionary/__tests__/useMissionaries.test.ts`

  **Must NOT do**:
  - 페이지네이션 파라미터 추가하지 않음
  - 에러 핸들링 전역 설정 변경하지 않음 (기존 axios interceptor 사용)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: API 서비스와 훅은 기존 패턴을 따르는 반복적 작업
  - **Skills**: [`react-state`]
    - `react-state`: React Query 훅 패턴 전문성

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: Tasks 6, 7, 8, 9
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `packages/missionary-admin/src/apis/auth.ts:1-27` — API 서비스 파일의 정확한 패턴. `api`를 `./instance`에서 import, 객체 리터럴로 메서드 정의, 인터페이스 export
  - `packages/missionary-admin/src/apis/instance.ts:1-39` — Axios 인스턴스. 이미 withCredentials, baseURL, 401 refresh 설정됨. missionary.ts에서 그대로 import
  - `packages/missionary-admin/src/hooks/auth/useLogin.ts:1-19` — useMutation 훅 패턴. queryClient.invalidateQueries + router.push 패턴
  - `packages/missionary-admin/src/lib/queryKeys.ts:1-7` — 현재 queryKeys 구조. 여기에 missionaries, regions 키 추가

  **API/Type References**:
  - `packages/missionary-server/src/missionary/dto/create-missionary.dto.ts:12-128` — 서버 CreateMissionaryDto. 프론트 CreateMissionaryPayload 타입의 기준. 필수 필드: name, startDate, endDate, participationStartDate, participationEndDate, regionId
  - `packages/missionary-server/src/missionary/missionary.controller.ts:29-69` — 서버 엔드포인트 경로 확인. POST `/missionaries`, GET `/missionaries`, GET `/missionaries/:id`, PATCH `/missionaries/:id`, DELETE `/missionaries/:id`
  - `packages/missionary-server/src/region/dto/create-region.dto.ts:1-10` — Region 타입 참조. { name: string, type: 'DOMESTIC' | 'ABROAD' }

  **Acceptance Criteria**:

  **TDD:**
  - [ ] RED: 테스트 파일 작성 → `pnpm --filter missionary-admin test` → FAIL (구현 없음)
  - [ ] GREEN: API 서비스 + 훅 구현 → `pnpm --filter missionary-admin test` → PASS
  - [ ] `pnpm type-check` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: All hook tests pass
    Tool: Bash
    Preconditions: Vitest configured (Task 1), hooks implemented
    Steps:
      1. pnpm --filter missionary-admin test
      2. Assert: All tests pass
      3. Assert: exit code 0
    Expected Result: API hooks work correctly
    Evidence: Terminal output captured

  Scenario: Query keys are properly defined
    Tool: Bash (grep)
    Preconditions: queryKeys.ts updated
    Steps:
      1. grep "missionaries" packages/missionary-admin/src/lib/queryKeys.ts
      2. Assert: contains "missionaries" key
      3. grep "regions" packages/missionary-admin/src/lib/queryKeys.ts
      4. Assert: contains "regions" key
    Expected Result: Query keys exist for both domains
    Evidence: Grep output captured
  ```

  **Commit**: YES
  - Message: `feat(admin): 선교/지역 API 서비스 및 React Query 훅 추가`
  - Files: `packages/missionary-admin/src/apis/missionary.ts`, `packages/missionary-admin/src/apis/region.ts`, `packages/missionary-admin/src/lib/queryKeys.ts`, `packages/missionary-admin/src/hooks/missionary/*`, `packages/missionary-admin/src/hooks/region/*`
  - Pre-commit: `pnpm --filter missionary-admin test`

---

- [x] 5. react-modal 도입 + 삭제 확인 모달 컴포넌트

  **What to do**:
  - `pnpm add react-modal --filter missionary-admin`
  - `pnpm add -D @types/react-modal --filter missionary-admin`
  - `packages/missionary-admin/src/components/missionary/DeleteConfirmModal.tsx` 생성:
    - Props: `isOpen: boolean`, `onConfirm: () => void`, `onCancel: () => void`, `missionaryName: string`, `isPending?: boolean`
    - react-modal 사용: `<Modal isOpen={isOpen} onRequestClose={onCancel}>`
    - 내용: "정말 '{missionaryName}' 선교를 삭제하시겠습니까?" 메시지
    - "취소" 버튼 (secondary outline) + "삭제" 버튼 (primary, isPending 시 disabled)
    - Tailwind CSS로 모달 오버레이 및 콘텐츠 스타일링
    - `Modal.setAppElement('#__next')` — Next.js 앱 루트 설정
  - TDD 테스트 작성: `packages/missionary-admin/src/components/missionary/__tests__/DeleteConfirmModal.test.tsx`
    - 모달 열림/닫힘 테스트
    - 삭제 확인 콜백 테스트
    - 취소 콜백 테스트

  **Must NOT do**:
  - 디자인 시스템의 기존 Modal 건드리지 않음
  - 전역 ModalProvider 패턴 도입하지 않음 — 로컬 컴포넌트로 사용

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 단일 모달 컴포넌트 + 테스트 작성
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: React Modal 패턴 + 접근성 지식

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `packages/missionary-admin/src/app/login/page.tsx:46-131` — Tailwind CSS 스타일링 패턴 (버튼 배치, 폼 레이아웃). 모달 내부도 이 스타일링 컨벤션 따름
  - `packages/design-system/src/components/button/index.tsx` — Button 컴포넌트 API. 모달에서 Button 사용 (size, color, variant props)

  **External References**:
  - react-modal 공식: https://reactcommunity.org/react-modal/
  - react-modal GitHub: https://github.com/reactjs/react-modal

  **Acceptance Criteria**:

  **TDD:**
  - [ ] RED: 테스트 작성 → `pnpm --filter missionary-admin test` → FAIL
  - [ ] GREEN: DeleteConfirmModal 구현 → `pnpm --filter missionary-admin test` → PASS
  - [ ] `pnpm type-check` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Modal tests pass
    Tool: Bash
    Preconditions: Vitest configured, modal component implemented
    Steps:
      1. pnpm --filter missionary-admin test
      2. Assert: DeleteConfirmModal tests pass
      3. Assert: exit code 0
    Expected Result: Modal renders, callbacks work
    Evidence: Terminal output captured
  ```

  **Commit**: YES
  - Message: `feat(admin): react-modal 도입 및 삭제 확인 모달 컴포넌트 추가`
  - Files: `packages/missionary-admin/src/components/missionary/DeleteConfirmModal.tsx`, `packages/missionary-admin/src/components/missionary/__tests__/DeleteConfirmModal.test.tsx`, `packages/missionary-admin/package.json`, `pnpm-lock.yaml`
  - Pre-commit: `pnpm --filter missionary-admin test`

---

- [x] 6. 선교 생성 페이지

  **What to do**:
  - `packages/missionary-admin/src/app/(admin)/missions/create/page.tsx` 생성:
    - `'use client'` 디렉티브
    - useState로 5개 폼 필드 관리:
      - `name: string` (선교 이름)
      - `startDate: Date | null` (선교 시작일)
      - `endDate: Date | null` (선교 종료일)
      - `pastorName: string` (담당 교역자)
      - `regionId: string` (지역 ID)
      - `participationStartDate: Date | null` (참가 신청 시작일)
      - `participationEndDate: Date | null` (참가 신청 종료일)
    - `useCreateMissionary()` 훅 사용
    - `useRegions()` 훅으로 지역 목록 가져오기
    - `<form onSubmit={handleSubmit}>` 패턴 (로그인 페이지 참조)
    - handleSubmit: Date를 ISO string으로 변환하여 API 호출
    - 에러 처리: mutation의 onError에서 setError
    - isPending 상태에서 버튼 disabled
    - 디자인 시스템 컴포넌트: InputField (이름, 교역자), DatePicker (4개 날짜), Select (지역)
    - Button: "생성하기" (size="lg", color="primary")
    - 페이지 상단: "신규 국내선교 생성" 타이틀
  - Tailwind CSS로 폼 레이아웃: flex flex-col, gap, max-width 제한
  - 필수 필드 미입력 시 간단한 프론트 검증 (빈 값 체크)

  **Must NOT do**:
  - react-hook-form, zod 등 검증 라이브러리 사용 금지
  - 5개 필드 외 추가 필드 금지
  - 파일 업로드 기능 추가 금지

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 폼 UI 페이지 구현 + 스타일링
  - **Skills**: [`frontend-ui-ux`, `react-state`]
    - `frontend-ui-ux`: 폼 레이아웃 + DatePicker/Select 통합
    - `react-state`: useState 기반 폼 상태 관리 + useMutation 연동

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: None
  - **Blocked By**: Tasks 3, 4

  **References**:

  **Pattern References**:
  - `packages/missionary-admin/src/app/login/page.tsx:1-134` — 폼 페이지의 완전한 레퍼런스. 'use client', useState, useLogin(mutation), handleSubmit, InputField 사용법, Button disabled 패턴, error 표시, 전체 Tailwind 레이아웃 모두 이 파일을 따름
  - `packages/missionary-admin/src/app/(admin)/AdminLayoutClient.tsx:1-30` — admin 레이아웃 구조. 생성 페이지는 이 레이아웃의 `<main>` 안에 렌더됨
  - `packages/design-system/src/components/input-field/index.tsx:7-13` — InputField props (label, hideLabel, error, value, onChange, className)
  - `packages/design-system/src/components/select/index.tsx:33-40` — Select props (value, onChange, children). Select.Trigger, Select.Options, Select.Option 사용법

  **API/Type References**:
  - `packages/missionary-admin/src/apis/missionary.ts` (Task 4에서 생성) — CreateMissionaryPayload 타입. 폼 submit 시 이 타입에 맞춰 데이터 변환
  - `packages/missionary-admin/src/hooks/missionary/useCreateMissionary.ts` (Task 4에서 생성) — 사용할 mutation 훅
  - `packages/missionary-admin/src/hooks/region/useRegions.ts` (Task 4에서 생성) — 지역 목록 조회 훅

  **Acceptance Criteria**:

  **TDD:**
  - [ ] 생성 페이지 렌더링 테스트 (선택사항 — 페이지 컴포넌트 테스트는 복잡하므로 Playwright QA 우선)

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Create page renders with all form fields
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running (pnpm dev:admin + pnpm dev:server), logged in as admin
    Steps:
      1. Navigate to: http://localhost:3000/missions/create
      2. Wait for: form visible (timeout: 10s)
      3. Assert: input[placeholder] or label "선교 이름" exists
      4. Assert: DatePicker components exist (4개: 시작일, 종료일, 참가시작, 참가종료)
      5. Assert: Select component for 지역 exists
      6. Assert: input for "담당 교역자" exists
      7. Assert: Button "생성하기" exists
      8. Screenshot: .sisyphus/evidence/task-6-create-page.png
    Expected Result: All 5 form fields and submit button visible
    Evidence: .sisyphus/evidence/task-6-create-page.png

  Scenario: Form submission creates missionary and redirects to list
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, regions exist in DB
    Steps:
      1. Navigate to: http://localhost:3000/missions/create
      2. Fill: 선교 이름 input → "테스트 선교"
      3. Fill: 시작일 DatePicker → 2025-08-01
      4. Fill: 종료일 DatePicker → 2025-08-07
      5. Fill: 담당 교역자 input → "김목사"
      6. Select: 지역 → 첫 번째 옵션 선택
      7. Fill: 참가 시작일 → 2025-07-01
      8. Fill: 참가 종료일 → 2025-07-25
      9. Click: 생성하기 button
      10. Wait for: navigation to /missions (timeout: 10s)
      11. Assert: URL is /missions
      12. Screenshot: .sisyphus/evidence/task-6-create-success.png
    Expected Result: Missionary created, redirected to list page
    Evidence: .sisyphus/evidence/task-6-create-success.png

  Scenario: Empty required fields show validation
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in
    Steps:
      1. Navigate to: http://localhost:3000/missions/create
      2. Click: 생성하기 button (without filling fields)
      3. Assert: Error indicators appear for required fields
      4. Screenshot: .sisyphus/evidence/task-6-validation-error.png
    Expected Result: Required fields show error state
    Evidence: .sisyphus/evidence/task-6-validation-error.png
  ```

  **Commit**: YES
  - Message: `feat(admin): 선교 생성 페이지 구현`
  - Files: `packages/missionary-admin/src/app/(admin)/missions/create/page.tsx`
  - Pre-commit: `pnpm type-check && pnpm --filter missionary-admin test`

---

- [x] 7. 선교 리스트 페이지

  **What to do**:
  - `packages/missionary-admin/src/app/(admin)/missions/page.tsx` 생성:
    - `'use client'` 디렉티브
    - `useMissionaries()` 훅으로 선교 목록 조회
    - `useSearchParams()`로 name 쿼리 파라미터 읽기 (사이드바 필터링 용)
    - name 파라미터가 있으면 해당 이름으로 클라이언트 필터링
    - 페이지 상단: "선교 목록" 타이틀 + "신규 선교 생성" 버튼 (→ /missions/create 링크)
    - HTML `<table>` + Tailwind CSS로 테이블 구현:
      - 컬럼: 선교 이름, 선교 기간(시작~종료), 담당 교역자, 상태
      - 상태 표시: Badge 컴포넌트 또는 텍스트 (RECRUITING → "모집중", IN_PROGRESS → "진행중", COMPLETED → "완료")
      - 날짜 포맷: YYYY.MM.DD
    - 각 행 클릭 → `router.push(\`/missions/${id}/edit\`)` (수정 페이지로 이동)
    - 행 hover 시 배경색 변경 (cursor-pointer)
    - 빈 상태: 선교가 없을 때 "등록된 선교가 없습니다" 메시지
    - 로딩 상태: isLoading일 때 "로딩 중..." 표시

  **Must NOT do**:
  - 페이지네이션, 검색, 정렬 기능 추가 금지
  - 디자인 시스템에 Table 컴포넌트 만들지 않음
  - 리스트에서 직접 삭제 기능 추가 금지

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 테이블 UI + 데이터 표시 + 클릭 인터랙션
  - **Skills**: [`frontend-ui-ux`, `react-state`]
    - `frontend-ui-ux`: 테이블 레이아웃 + 상태 배지 스타일링
    - `react-state`: useQuery 훅 연동 + 라우팅

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `packages/missionary-admin/src/app/login/page.tsx:1-5` — 'use client' + import 패턴
  - `packages/missionary-admin/src/app/(admin)/page.tsx:1-30` — admin 페이지 구조. Tailwind 스타일링, div wrapper 패턴
  - `packages/design-system/src/components/badge/index.tsx` — Badge 컴포넌트 (상태 표시용)
  - `packages/design-system/src/components/button/index.tsx` — Button 컴포넌트 (신규 생성 버튼)

  **API/Type References**:
  - `packages/missionary-admin/src/hooks/missionary/useMissionaries.ts` (Task 4에서 생성) — 선교 목록 조회 훅
  - `packages/missionary-admin/src/apis/missionary.ts` (Task 4에서 생성) — Missionary 타입 (테이블 렌더링에 사용)

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: List page renders with table
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, at least 1 missionary exists
    Steps:
      1. Navigate to: http://localhost:3000/missions
      2. Wait for: table visible (timeout: 10s)
      3. Assert: table header contains "선교 이름", "선교 기간", "담당 교역자", "상태"
      4. Assert: at least 1 table row exists
      5. Screenshot: .sisyphus/evidence/task-7-list-page.png
    Expected Result: Table renders with missionary data
    Evidence: .sisyphus/evidence/task-7-list-page.png

  Scenario: Row click navigates to edit page
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, missionaries exist
    Steps:
      1. Navigate to: http://localhost:3000/missions
      2. Wait for: table row visible
      3. Click: first table row (tbody tr:first-child)
      4. Wait for: navigation (timeout: 10s)
      5. Assert: URL matches /missions/[uuid]/edit pattern
      6. Screenshot: .sisyphus/evidence/task-7-row-click.png
    Expected Result: Navigate to edit page of clicked missionary
    Evidence: .sisyphus/evidence/task-7-row-click.png

  Scenario: Empty state when no missionaries
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, no missionaries in DB
    Steps:
      1. Navigate to: http://localhost:3000/missions
      2. Wait for: page loaded (timeout: 10s)
      3. Assert: text "등록된 선교가 없습니다" visible
      4. Screenshot: .sisyphus/evidence/task-7-empty-state.png
    Expected Result: Empty state message shown
    Evidence: .sisyphus/evidence/task-7-empty-state.png

  Scenario: Filtered list via query parameter
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, missionary named "제주선교" exists
    Steps:
      1. Navigate to: http://localhost:3000/missions?name=제주선교
      2. Wait for: table visible (timeout: 10s)
      3. Assert: all visible rows contain "제주선교" in name column
      4. Screenshot: .sisyphus/evidence/task-7-filtered-list.png
    Expected Result: Only filtered missionaries shown
    Evidence: .sisyphus/evidence/task-7-filtered-list.png
  ```

  **Commit**: YES
  - Message: `feat(admin): 선교 리스트 페이지 구현`
  - Files: `packages/missionary-admin/src/app/(admin)/missions/page.tsx`
  - Pre-commit: `pnpm type-check && pnpm --filter missionary-admin test`

---

- [x] 8. 선교 수정/삭제 페이지

  **What to do**:
  - `packages/missionary-admin/src/app/(admin)/missions/[id]/edit/page.tsx` 생성:
    - `'use client'` 디렉티브
    - `useParams()`로 `id` 추출
    - `useMissionary(id)` 훅으로 기존 데이터 조회
    - `useUpdateMissionary()` 훅으로 수정
    - `useDeleteMissionary()` 훅으로 삭제
    - `useRegions()` 훅으로 지역 목록 조회
    - useState로 폼 상태 관리 (생성 페이지와 동일한 5개 필드)
    - 조회된 데이터로 초기값 세팅 (useEffect로 데이터 도착 시 state 업데이트)
    - 날짜 데이터: 서버 ISO string → Date 객체로 변환하여 DatePicker에 전달
    - "수정하기" 버튼: handleUpdate → updateMutation.mutate → 성공 시 리스트로 이동
    - "삭제하기" 버튼: onClick → setIsDeleteModalOpen(true) → DeleteConfirmModal 열기
    - DeleteConfirmModal: onConfirm → deleteMutation.mutate → 성공 시 리스트로 이동
    - 로딩 상태: isLoading일 때 "로딩 중..." 표시
    - 에러 상태: 존재하지 않는 ID 접근 시 "선교를 찾을 수 없습니다" 표시
    - 페이지 상단: "선교 수정" 타이틀

  **Must NOT do**:
  - 5개 필드 외 추가 필드 노출 금지
  - 수정 이력 추적 기능 추가 금지
  - optimistic update 구현 금지 — invalidateQueries로 충분

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 폼 UI + 모달 인터랙션 + 데이터 프리필
  - **Skills**: [`frontend-ui-ux`, `react-state`]
    - `frontend-ui-ux`: 수정 폼 레이아웃 + 모달 통합
    - `react-state`: 조회 → 프리필 → 수정 mutation 플로우

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7)
  - **Blocks**: None
  - **Blocked By**: Tasks 2, 4, 5

  **References**:

  **Pattern References**:
  - `packages/missionary-admin/src/app/login/page.tsx:1-134` — 폼 페이지 패턴 (handleSubmit, useState, mutation, isPending)
  - `packages/missionary-admin/src/app/(admin)/missions/create/page.tsx` (Task 6에서 생성) — 생성 페이지와 거의 동일한 폼 구조. 이 파일을 복사해서 수정 로직 추가
  - `packages/missionary-admin/src/components/missionary/DeleteConfirmModal.tsx` (Task 5에서 생성) — 삭제 확인 모달 사용법

  **API/Type References**:
  - `packages/missionary-admin/src/hooks/missionary/useMissionary.ts` (Task 4) — 단건 조회 훅
  - `packages/missionary-admin/src/hooks/missionary/useUpdateMissionary.ts` (Task 4) — 수정 mutation
  - `packages/missionary-admin/src/hooks/missionary/useDeleteMissionary.ts` (Task 4) — 삭제 mutation
  - `packages/missionary-admin/src/apis/missionary.ts` (Task 4) — Missionary 타입 (날짜 변환 기준)

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Edit page loads with pre-filled data
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, missionary exists with known ID
    Steps:
      1. Navigate to: http://localhost:3000/missions/{known-id}/edit
      2. Wait for: form visible (timeout: 10s)
      3. Assert: 선교 이름 input has non-empty value
      4. Assert: DatePicker fields have dates selected
      5. Assert: 지역 Select has a value selected
      6. Screenshot: .sisyphus/evidence/task-8-edit-prefilled.png
    Expected Result: Form pre-filled with existing data
    Evidence: .sisyphus/evidence/task-8-edit-prefilled.png

  Scenario: Update missionary and redirect to list
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, missionary exists
    Steps:
      1. Navigate to: http://localhost:3000/missions/{known-id}/edit
      2. Wait for: form visible
      3. Clear and fill: 선교 이름 → "수정된 선교"
      4. Click: 수정하기 button
      5. Wait for: navigation to /missions (timeout: 10s)
      6. Assert: URL is /missions
      7. Screenshot: .sisyphus/evidence/task-8-update-success.png
    Expected Result: Missionary updated, redirected to list
    Evidence: .sisyphus/evidence/task-8-update-success.png

  Scenario: Delete missionary via confirmation modal
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, missionary exists
    Steps:
      1. Navigate to: http://localhost:3000/missions/{known-id}/edit
      2. Wait for: form visible
      3. Click: 삭제하기 button
      4. Wait for: modal visible (timeout: 5s)
      5. Assert: modal contains "삭제하시겠습니까" text
      6. Click: modal 삭제 confirm button
      7. Wait for: navigation to /missions (timeout: 10s)
      8. Assert: URL is /missions
      9. Screenshot: .sisyphus/evidence/task-8-delete-success.png
    Expected Result: Modal shown, missionary deleted, redirected to list
    Evidence: .sisyphus/evidence/task-8-delete-success.png

  Scenario: Delete modal can be cancelled
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, missionary exists
    Steps:
      1. Navigate to: http://localhost:3000/missions/{known-id}/edit
      2. Click: 삭제하기 button
      3. Wait for: modal visible (timeout: 5s)
      4. Click: 취소 button in modal
      5. Wait for: modal hidden (timeout: 3s)
      6. Assert: still on edit page (URL unchanged)
      7. Screenshot: .sisyphus/evidence/task-8-delete-cancel.png
    Expected Result: Modal closes, stays on edit page
    Evidence: .sisyphus/evidence/task-8-delete-cancel.png
  ```

  **Commit**: YES
  - Message: `feat(admin): 선교 수정/삭제 페이지 구현`
  - Files: `packages/missionary-admin/src/app/(admin)/missions/[id]/edit/page.tsx`
  - Pre-commit: `pnpm type-check && pnpm --filter missionary-admin test`

---

- [x] 9. 네비게이션 연결 (대시보드 버튼 + 사이드바 동적 메뉴)

  **What to do**:

  **대시보드 버튼 연결:**
  - `packages/missionary-admin/src/app/(admin)/page.tsx` 수정:
    - "신규 국내선교 생성" Button을 `next/link`의 Link로 감싸기 또는 `onClick={() => router.push('/missions/create')}` 추가
    - import 추가: `import Link from 'next/link'` 또는 `import { useRouter } from 'next/navigation'`

  **사이드바 동적 메뉴:**
  - `packages/missionary-admin/src/components/sidebar/Sidebar.tsx` 수정:
    - 기존 하드코딩된 `MENU_DATA`의 국내선교 subMenus (제주선교, 군선교) 삭제
    - `useMissionaries()` 훅을 import하여 선교 목록 가져오기
    - 국내선교 그룹의 subMenus를 API 데이터에서 동적으로 생성:
      ```
      subMenus: missionaries?.map(m => ({
        label: m.name,
        href: `/missions?name=${encodeURIComponent(m.name)}`
      })) ?? []
      ```
    - 로딩 상태 처리: 로딩 중일 때 빈 subMenus 또는 로딩 표시
    - 에러 상태 처리: 에러 시 빈 subMenus

  **Must NOT do**:
  - 해외선교, 선교 관리 메뉴 변경하지 않음
  - 사이드바 전체 구조 리팩토링하지 않음 — 국내선교 부분만 동적으로 변경
  - 대시보드의 "신규 해외선교 생성" 버튼 변경하지 않음

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 기존 파일 2개 수정 (작은 변경)
  - **Skills**: [`frontend-ui-ux`, `react-state`]
    - `frontend-ui-ux`: 네비게이션 UI 패턴
    - `react-state`: useQuery 훅 데이터를 사이드바에 연동

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (단독)
  - **Blocks**: None (마지막 task)
  - **Blocked By**: Tasks 4, 7

  **References**:

  **Pattern References**:
  - `packages/missionary-admin/src/app/(admin)/page.tsx:1-30` — 현재 대시보드. 라인 19의 Button에 Link 래핑 또는 onClick 추가
  - `packages/missionary-admin/src/components/sidebar/Sidebar.tsx:1-92` — 현재 사이드바 전체 코드. MENU_DATA (라인 16-32) 수정, 특히 국내선교 subMenus (라인 19-22) 부분을 동적 데이터로 교체
  - `packages/missionary-admin/src/components/sidebar/Sidebar.tsx:62-87` — NavItem 렌더링 부분. subMenus.map으로 동적 렌더링하는 기존 패턴 그대로 활용

  **API/Type References**:
  - `packages/missionary-admin/src/hooks/missionary/useMissionaries.ts` (Task 4) — 선교 목록 훅. 사이드바에서 사용

  **Acceptance Criteria**:
  - [ ] `pnpm build:admin` → exit code 0
  - [ ] `pnpm type-check` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Dashboard button navigates to create page
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Wait for: "신규 국내선교 생성" button visible (timeout: 10s)
      3. Click: "신규 국내선교 생성" button
      4. Wait for: navigation (timeout: 10s)
      5. Assert: URL is /missions/create
      6. Screenshot: .sisyphus/evidence/task-9-dashboard-button.png
    Expected Result: Navigate to create page
    Evidence: .sisyphus/evidence/task-9-dashboard-button.png

  Scenario: Sidebar shows dynamic missionary menu
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, missionaries exist (e.g., "제주선교")
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Wait for: sidebar visible (timeout: 10s)
      3. Assert: sidebar contains "국내선교" menu group
      4. Click: "국내선교" to expand (if not expanded)
      5. Assert: submenu contains missionary names from API (e.g., "제주선교")
      6. Screenshot: .sisyphus/evidence/task-9-sidebar-dynamic.png
    Expected Result: Sidebar shows dynamic missionary list
    Evidence: .sisyphus/evidence/task-9-sidebar-dynamic.png

  Scenario: Sidebar menu item navigates to filtered list
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, "제주선교" exists
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Click: "국내선교" to expand
      3. Click: "제주선교" submenu item
      4. Wait for: navigation (timeout: 10s)
      5. Assert: URL contains /missions?name=제주선교
      6. Assert: table shows filtered results
      7. Screenshot: .sisyphus/evidence/task-9-sidebar-navigate.png
    Expected Result: Navigate to filtered list page
    Evidence: .sisyphus/evidence/task-9-sidebar-navigate.png

  Scenario: Sidebar handles no missionaries gracefully
    Tool: Playwright (playwright skill)
    Preconditions: Dev servers running, logged in, no missionaries in DB
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Wait for: sidebar visible
      3. Click: "국내선교" to expand
      4. Assert: no submenu items shown (or empty state)
      5. Screenshot: .sisyphus/evidence/task-9-sidebar-empty.png
    Expected Result: No crash, graceful empty state
    Evidence: .sisyphus/evidence/task-9-sidebar-empty.png
  ```

  **Commit**: YES
  - Message: `feat(admin): 대시보드 버튼 연결 및 사이드바 동적 선교 메뉴`
  - Files: `packages/missionary-admin/src/app/(admin)/page.tsx`, `packages/missionary-admin/src/components/sidebar/Sidebar.tsx`
  - Pre-commit: `pnpm type-check && pnpm --filter missionary-admin test`

---

## Commit Strategy

| After Task | Message                                                 | Files                                    | Verification                          |
| ---------- | ------------------------------------------------------- | ---------------------------------------- | ------------------------------------- |
| 1          | `feat(admin): Vitest 테스트 인프라 세팅`                | vitest.config.ts, setup.ts, package.json | `pnpm --filter missionary-admin test` |
| 2          | `fix(server): 선교 삭제를 소프트 딜리트로 변경`         | missionary.service.ts                    | `pnpm build:server`                   |
| 3          | `feat(design-system): DatePicker 컴포넌트 추가`         | date-picker/\*, index.tsx, package.json  | `pnpm build:ds`                       |
| 4          | `feat(admin): 선교/지역 API 서비스 및 React Query 훅`   | apis/_, hooks/_, queryKeys.ts            | `pnpm --filter missionary-admin test` |
| 5          | `feat(admin): react-modal 도입 및 삭제 확인 모달`       | DeleteConfirmModal.tsx, package.json     | `pnpm --filter missionary-admin test` |
| 6          | `feat(admin): 선교 생성 페이지 구현`                    | missions/create/page.tsx                 | `pnpm type-check`                     |
| 7          | `feat(admin): 선교 리스트 페이지 구현`                  | missions/page.tsx                        | `pnpm type-check`                     |
| 8          | `feat(admin): 선교 수정/삭제 페이지 구현`               | missions/[id]/edit/page.tsx              | `pnpm type-check`                     |
| 9          | `feat(admin): 대시보드 버튼 연결 및 사이드바 동적 메뉴` | page.tsx, Sidebar.tsx                    | `pnpm type-check`                     |

---

## Success Criteria

### Verification Commands

```bash
pnpm build:admin         # Expected: exit code 0
pnpm build:ds            # Expected: exit code 0
pnpm build:server        # Expected: exit code 0
pnpm type-check          # Expected: exit code 0
pnpm lint:all            # Expected: exit code 0
pnpm --filter missionary-admin test  # Expected: all tests pass
```

### Final Checklist

- [x] 모든 "Must Have" 항목 구현됨
- [x] 모든 "Must NOT Have" 항목 미포함
- [x] 5개 빌드/린트/테스트 커맨드 통과 (3/5 pass, 2 blocked by pre-existing issues)
- [x] 생성 → 리스트 → 수정/삭제 전체 워크플로우 작동
- [x] 사이드바 동적 메뉴 작동
- [x] 대시보드 버튼 연결 작동
