# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A pnpm monorepo ("missionary-client") with four packages:
- **@samilhero/design-system** — Shared UI component library with Storybook
- **missionary-app** — Main user-facing Next.js 16 application
- **missionary-admin** — Admin Next.js 16 application
- **missionary-server** — NestJS 11 API server

Package manager: **pnpm 10.28.1**, Node 20.

### Key Dependencies
- React 19, Next.js 16 (Turbopack default)
- TypeScript 5.9 (`moduleResolution: "bundler"`)
- Emotion CSS-in-JS (`@emotion/react`, `@emotion/styled`)
- Storybook 8.6
- NestJS 11 (missionary-server, `moduleResolution: "node"`, CommonJS)
- Prisma ORM + PostgreSQL (missionary-server)

## Commands

### Development
```bash
pnpm dev:app          # missionary-app dev server
pnpm dev:admin        # missionary-admin dev server
pnpm dev:ds           # design-system dev server
pnpm dev:server       # missionary-server dev (port 3100)
pnpm dev:all          # all four in parallel
pnpm sb:ds            # Storybook for design-system (port 6006)
```

### Build
```bash
pnpm build:app        # build missionary-app
pnpm build:admin      # build missionary-admin
pnpm build:ds         # build design-system
pnpm build:server     # build missionary-server
pnpm build:all        # build all
```

### Linting & Formatting
```bash
pnpm lint:all         # ESLint + Prettier + Stylelint checks
pnpm lint:fix:all     # auto-fix all
pnpm type-check       # TypeScript type checking across packages
```

### Server Database (Prisma)
```bash
pnpm --filter missionary-server prisma:generate        # Prisma Client 생성
pnpm --filter missionary-server prisma:migrate:dev      # 마이그레이션 생성/적용 (개발)
pnpm --filter missionary-server prisma:migrate:deploy   # 마이그레이션 적용 (프로덕션)
pnpm --filter missionary-server prisma:studio           # Prisma Studio GUI
pnpm --filter missionary-server db:push                 # 스키마 직접 반영 (프로토타이핑)
pnpm --filter missionary-server db:reset                # DB 초기화
```

### Dependencies
```bash
pnpm add <pkg> --filter <package-name>   # add dependency to specific package
```

## Code Quality Rules (최우선 적용)

> 출처: https://frontend-fundamentals.com/code-quality/code/
> 코드 작성 시 아래 규칙을 최우선으로 따른다. 좋은 코드란 "변경하기 쉬운 코드"이다.

### 1. 가독성 (Readability)
읽는 사람이 한 번에 고려하는 맥락을 최소화하고, 위에서 아래로 자연스럽게 읽히도록 작성한다.

**맥락 줄이기:**
- 같이 실행되지 않는 코드는 별도 컴포넌트/함수로 분리한다 (예: 권한별 분기 → 컴포넌트 분리)
- 구현 상세는 추상화한다 (예: 인증 로직 → `AuthGuard` 래퍼로 분리)
- 로직 종류별로 함수를 쪼갠다 (예: 모든 쿼리 파라미터를 하나의 Hook에 넣지 않는다)

**이름 붙이기:**
- 복잡한 조건식에는 의미 있는 변수명을 부여한다: `const isSameCategory = category.id === targetCategory.id`
- 매직 넘버에는 상수명을 부여한다: `const ANIMATION_DELAY_MS = 300`

**위에서 아래로 읽히게:**
- 시점 이동을 줄인다 — 코드를 이해하기 위해 다른 파일/함수를 오가는 횟수를 최소화한다
- 중첩 삼항 연산자 대신 if/early return 패턴을 사용한다
- 범위 비교는 수학 부등식처럼 작성한다: `if (80 <= score && score <= 100)`

### 2. 예측 가능성 (Predictability)
함수/컴포넌트의 이름, 파라미터, 반환값만 보고 동작을 예측할 수 있어야 한다.

- 이름이 겹치지 않게 관리한다 — 같은 이름은 같은 동작을 해야 한다 (예: `http.get` vs `httpService.getWithAuth`)
- 같은 종류의 함수는 반환 타입을 통일한다 (예: 모든 API Hook이 Query 객체를 반환)
- 숨은 로직을 드러낸다 — 함수 내부에 이름/파라미터로 예측 불가능한 부수 효과(로깅 등)를 넣지 않는다

### 3. 응집도 (Cohesion)
함께 수정되는 코드는 함께 위치시킨다.

- 함께 수정되는 파일을 같은 디렉토리에 둔다 (종류별 분류보다 도메인별 분류 우선)
- 매직 넘버를 상수로 추출하여 한 곳에서 관리한다
- 폼 필드의 응집도를 고려한다 — 필드 간 의존성이 있으면 폼 전체 단위, 독립적이면 필드 단위

**가독성 vs 응집도 충돌 시:** 함께 수정하지 않으면 오류가 발생할 수 있는 경우 응집도를 우선한다. 위험성이 낮으면 가독성을 우선하여 코드 중복을 허용한다.

### 4. 결합도 (Coupling)
코드 수정 시 영향 범위를 최소화한다.

- 책임을 하나씩 관리한다 — 하나의 Hook/함수가 하나의 역할만 담당한다
- 성급한 공통화보다 중복 코드를 허용한다 — 페이지마다 동작이 다를 가능성이 있으면 각각 작성한다
- Props Drilling이 발생하면 조합(Composition) 패턴을 먼저 시도하고, 그래도 해결 안 되면 Context API를 사용한다

## Architecture

### Monorepo Structure
- `/packages/design-system/` — component library consumed by both apps
- `/packages/missionary-app/` — main app, imports design-system via `workspace:*`
- `/packages/missionary-admin/` — admin app, imports design-system via `workspace:*`
- `/packages/missionary-server/` — NestJS API server (독립 tsconfig, base 미상속)

### Lint & Formatting Config
All config files are at the project root (single file each):
- `eslint.config.mjs` — ESLint flat config (typescript-eslint + import order + react-hooks)
  - `packages/missionary-server/**`는 별도 블록: react-hooks 비활성화, `globals.node` 적용
- `.prettierrc` — Prettier settings
- `.stylelintrc.json` — Stylelint for SCSS files only (`stylelint-config-standard-scss`)

### Path Aliases
All packages use `@*` path aliases (baseUrl: `./src`). In apps, these resolve to the design-system source:
- missionary-app: `"@*" → "../../design-system/src/*"`
- missionary-admin: `"@*" → "../../design-system/src/*"`
- design-system: `"@*" → "./*"` (local)
- missionary-server: `"@/*" → "./src/*"` (local, 서버 전용)

### Styling
Emotion CSS-in-JS for component styling. Each component typically has a layout file (e.g., `ButtonLayout.ts`) with styled components. SCSS is used for global/utility styles. Color palette is centralized in `design-system/src/styles/color.ts`. `next.config.js` enables `compiler: { emotion: true }`.

### Design System Component Pattern
Components follow a consistent structure:
- `index.tsx` — component logic with forwardRef
- `*Layout.ts` — Emotion styled components
- `index.stories.tsx` — Storybook stories
- Support both controlled and uncontrolled usage via `useControllableState`
- Context pattern (`useSafeContext`, `useContextData`, `useContextAction`) for compound components
- React 19: new components should use `ref` as a regular prop instead of `forwardRef`

### NestJS Server Pattern
`missionary-server`는 NestJS의 Module/Controller/Service 패턴을 따른다.

**디렉토리 구조 (도메인별 분류):**
```
src/
├── main.ts                     # 엔트리포인트
├── app.module.ts               # 루트 모듈
├── app.controller.ts           # health check 등 루트 엔드포인트
├── app.service.ts
└── <domain>/                   # 도메인별 디렉토리
    ├── <domain>.module.ts
    ├── <domain>.controller.ts
    ├── <domain>.service.ts
    ├── dto/                    # Request/Response DTO
    │   ├── create-<domain>.dto.ts
    │   └── update-<domain>.dto.ts
    └── entities/               # 엔티티 (DB 연동 시)
        └── <domain>.entity.ts
```

**파일 네이밍:** `<도메인>.<역할>.ts` — 예: `user.controller.ts`, `user.service.ts`, `user.module.ts`

**핵심 규칙:**
- 하나의 Module이 하나의 도메인을 담당한다 (응집도 원칙)
- Controller는 요청/응답 처리만, 비즈니스 로직은 Service에 위임한다
- Service 간 의존은 Module의 `imports`/`exports`를 통해 명시적으로 관리한다
- DTO로 요청/응답 형태를 명시하여 예측 가능성을 확보한다

### Git Workflow
- Branches: `dev` (primary), `prod` (production), feature branches as `feat/SMH-*`
- Commits reference Jira tickets: `[SMH-XX] description`
- PR template requires Jira link, background, feature description, and usage examples
- Pre-commit hook runs `pnpm lint:fix:all && pnpm type-check`
- Pre-push hook runs `pnpm lint:all`
- CI runs lint and build matrix on PRs to `dev`
- `dev` branch is protected — changes require PR (direct push not allowed)
