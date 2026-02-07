# missionary-api → missionary-server 전체 마이그레이션

## TL;DR

> **Quick Summary**: Spring Boot(Java) missionary-api의 전체 도메인과 고급 기능을 NestJS missionary-server로 마이그레이션. Prisma 스키마 전면 재설계(UUID 통일), RBAC, Soft Delete, Audit Trail, BullMQ, AES 암호화, CSV export 등 Spring과 동일 수준의 기능을 NestJS 관용구에 맞게 구현한다.
>
> **Deliverables**:
>
> - 전면 재설계된 Prisma 스키마 (15+ 모델, UUID 기반)
> - 8개 NestJS 도메인 모듈 (Missionary, Participation, Team, Staff, Church, Board, Region, Terms)
> - RBAC 인증/인가 시스템 (Roles decorator + RolesGuard)
> - 공통 인프라 (Soft Delete, Audit Trail, AES 암호화, PII 마스킹)
> - BullMQ 비동기 처리 (참가 신청)
> - CSV export, 스케줄러
> - Jest 테스트 인프라 + TDD
>
> **Estimated Effort**: XL (10 phases)
> **Parallel Execution**: YES - 일부 도메인 모듈 병렬 가능
> **Critical Path**: Infra → Schema → Missionary → Participation → Team/Staff → Church → Board → Terms → CSV/Scheduler

---

## Context

### Original Request

missionary-api(Spring Boot/Java) 프로젝트의 전체 DB와 API를 우리 NestJS 서버에 적용하고 싶다.

### Interview Summary

**Key Discussions**:

- **마이그레이션 범위**: 전체 도메인 + 전체 고급 기능 (Spring과 동일 수준)
- **DB 스키마**: 전면 재설계 (missionary-api 기준, UUID 통일)
- **API 구조**: 리소스 기반 URL + RBAC 가드 (NestJS 최적화)
- **Member 모델**: 단일 User + role enum (Spring의 3테이블 다형성 대신)
- **테스트**: TDD (Jest, 테스트 인프라 없음 → 세팅 필요)
- **메시지 큐**: BullMQ (Redis 기반, Spring의 RabbitMQ 대체)
- **기존 데이터**: 테스트만 → DB 리셋 가능

### Metis Review

**Identified Gaps** (addressed):

- ID 전략 (Int → UUID): UUID 통일로 결정
- Member 모델 복잡도: 단일 User + role enum으로 단순화
- Prisma soft delete 한계: prisma-extension-soft-delete 패키지 사용
- 기존 데이터 호환: DB 리셋 가능 확인
- Board 파일 업로드 스코프: Board는 포함하되 파일 업로드/스토리지는 후속 작업으로 분리

---

## Work Objectives

### Core Objective

missionary-api(Spring Boot)의 전체 비즈니스 도메인과 인프라 기능을 NestJS/Prisma 기반 missionary-server에 구현하여, 동일한 수준의 API 서비스를 제공한다.

### Concrete Deliverables

- `prisma/schema.prisma` — 15+ 모델 전면 재설계
- `src/common/` — Soft Delete, Audit Trail, AES 암호화, PII 마스킹, RBAC
- `src/missionary/` — Missionary 도메인 모듈 (리팩터링)
- `src/participation/` — Participation 도메인 모듈
- `src/team/` — Team 도메인 모듈
- `src/staff/` — Staff 도메인 모듈
- `src/church/` — Church 도메인 모듈
- `src/board/` — Board 도메인 모듈
- `src/region/` — Region 도메인 모듈
- `src/terms/` — Terms 도메인 모듈
- `src/common/queue/` — BullMQ 설정 + Participation 프로세서
- `src/common/csv/` — CSV export 유틸리티
- `src/common/scheduler/` — PII 정리 스케줄러
- Jest 테스트 파일 (모든 도메인)

### Definition of Done

- [x] `pnpm --filter missionary-server prisma:generate` — Exit 0
- [x] `pnpm type-check` — Exit 0
- [x] `pnpm build:server` — Exit 0
- [x] `pnpm --filter missionary-server test` — 모든 테스트 통과
- [x] 모든 엔드포인트 Swagger 문서화
- [x] Soft Delete 동작 검증 (삭제 → DB에 deletedAt 설정 → API 조회 시 미표시)
- [x] RBAC 동작 검증 (USER 역할 → admin 전용 엔드포인트 403)

### Must Have

- Spring API의 모든 도메인 엔드포인트 대응
- UUID 기반 PK 통일
- Soft Delete + Audit Trail 전체 적용
- RBAC (USER, ADMIN, STAFF 역할 기반 접근 제어)
- BullMQ 비동기 참가 처리
- AES 암호화 (주민등록번호 등 민감 정보)
- CSV export (참가자 목록)
- TDD (모든 새 모듈)

### Must NOT Have (Guardrails)

- 파일 업로드/스토리지 (Board 첨부파일은 스키마만, 실제 업로드 로직은 후속)
- 프론트엔드 변경 (별도 계획)
- 배포/인프라 설정 (Docker, CI/CD 등)
- 범용 BaseCrudService<T> 같은 성급한 추상화 — 각 서비스가 직접 Prisma 쿼리 작성
- Spring의 역할별 URL 분리 (/api/admin/, /api/user/) — 리소스 기반 URL + RBAC 가드 사용
- JSON 컬럼으로 임베디드 객체 저장 — 반드시 플래트 컬럼 사용
- 불필요한 패키지 설치 — Spring 의존성을 직접 대체하는 것만 설치
- 함수/getter에 JSDoc 남발 — 동작이 비자명한 곳에만

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.

### Test Decision

- **Infrastructure exists**: NO → Phase 1에서 세팅
- **Automated tests**: YES (TDD)
- **Framework**: Jest (NestJS 기본 내장)

### If TDD Enabled

Each TODO follows RED-GREEN-REFACTOR:

**Task Structure:**

1. **RED**: Write failing test first
   - Test command: `pnpm --filter missionary-server test <file>`
   - Expected: FAIL
2. **GREEN**: Implement minimum code to pass
   - Expected: PASS
3. **REFACTOR**: Clean up while keeping green
   - Expected: PASS (still)

**Test Setup Task (Phase 1):**

- [x] 0. Setup Jest Test Infrastructure
  - NestJS 프로젝트에 Jest가 이미 devDependencies에 있으나 설정 필요
  - Verify: `pnpm --filter missionary-server test` → 실행 가능

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

**Verification Tool by Deliverable Type:**

| Type             | Tool          | How Agent Verifies                                        |
| ---------------- | ------------- | --------------------------------------------------------- |
| **API Endpoint** | Bash (curl)   | Send requests, parse responses, assert fields             |
| **DB Schema**    | Bash (prisma) | `prisma validate`, `prisma generate`                      |
| **Auth/RBAC**    | Bash (curl)   | Login → get token → test authorized/unauthorized requests |
| **Unit Test**    | Bash (jest)   | `pnpm --filter missionary-server test`                    |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
└── Task 1: Test Infrastructure + Common Utilities (Soft Delete, Audit, RBAC, AES, PII)

Wave 2 (After Wave 1):
└── Task 2: Prisma Schema 전면 재설계 + Migration

Wave 3 (After Wave 2):
├── Task 3: User Module 리팩터링 (UUID + 확장 필드)
└── Task 4: Auth Module RBAC 확장

Wave 4 (After Wave 3):
├── Task 5: Region Module
└── Task 6: Church Module

Wave 5 (After Wave 4):
└── Task 7: Missionary Module 리팩터링

Wave 6 (After Wave 5):
├── Task 8: Participation Module + BullMQ
└── Task 9: Staff Module

Wave 7 (After Wave 6):
└── Task 10: Team Module

Wave 8 (After Wave 7):
├── Task 11: Board Module
└── Task 12: Terms Module

Wave 9 (After Wave 8):
├── Task 13: CSV Export
└── Task 14: PII Scheduler

Wave 10 (Final):
└── Task 15: Integration 검증 + Swagger 정리
```

### Dependency Matrix

| Task | Depends On | Blocks      | Can Parallelize With |
| ---- | ---------- | ----------- | -------------------- |
| 1    | None       | 2-15        | None (foundation)    |
| 2    | 1          | 3-15        | None (schema)        |
| 3    | 2          | 7, 8, 9, 10 | 4                    |
| 4    | 2          | 5-15        | 3                    |
| 5    | 4          | 7           | 6                    |
| 6    | 4          | 7           | 5                    |
| 7    | 3, 5, 6    | 8, 9, 11    | None                 |
| 8    | 7          | 10, 13      | 9                    |
| 9    | 7          | None        | 8                    |
| 10   | 8          | None        | 11, 12               |
| 11   | 7          | None        | 12                   |
| 12   | 4          | None        | 11                   |
| 13   | 8, 10      | 15          | 14                   |
| 14   | 8          | 15          | 13                   |
| 15   | 1-14       | None        | None (final)         |

### Agent Dispatch Summary

| Wave | Tasks  | Recommended Agents                                        |
| ---- | ------ | --------------------------------------------------------- |
| 1    | 1      | `category="deep", load_skills=["api-design", "security"]` |
| 2    | 2      | `category="deep", load_skills=["api-design"]`             |
| 3    | 3, 4   | parallel: `category="unspecified-high"`                   |
| 4    | 5, 6   | parallel: `category="quick"`                              |
| 5    | 7      | `category="deep", load_skills=["api-design"]`             |
| 6    | 8, 9   | parallel: `category="deep"`                               |
| 7    | 10     | `category="unspecified-high"`                             |
| 8    | 11, 12 | parallel: `category="unspecified-high"`                   |
| 9    | 13, 14 | parallel: `category="quick"`                              |
| 10   | 15     | `category="deep"`                                         |

---

## TODOs

- [x] 1. Test Infrastructure + 공통 유틸리티 세팅

  **What to do**:
  - Jest 테스트 환경 설정 확인/수정 (`jest` config in package.json or jest.config.ts)
  - 테스트 DB 연결 설정 (테스트용 `.env.test` 또는 in-memory mock)
  - 예제 테스트 작성 및 실행 확인
  - `src/common/decorators/roles.decorator.ts` — Roles 데코레이터 (Reflector 기반)
  - `src/common/guards/roles.guard.ts` — RolesGuard (JWT payload에서 role 확인)
  - `src/common/middleware/soft-delete.ts` — prisma-extension-soft-delete 설정
  - `src/common/middleware/audit.ts` — Prisma middleware로 createdBy/updatedBy 자동 설정
  - `src/common/utils/encryption.ts` — AES-128-CBC 암호화/복호화 유틸 (Spring 호환)
  - `src/common/interceptors/masking.interceptor.ts` — PII 마스킹 인터셉터 (뒤 6자리 → **\*\***)
  - `src/common/utils/encryption.spec.ts`, `roles.guard.spec.ts`, `masking.interceptor.spec.ts` 등 TDD
  - 패키지 설치: `prisma-extension-soft-delete`, `@nestjs/bullmq`, `bullmq`, `ioredis`, `@nestjs/schedule`, `fast-csv`

  **Must NOT do**:
  - 도메인 모듈 구현
  - 스키마 변경
  - BaseCrudService 같은 범용 추상화

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`api-design`, `security`]
    - `api-design`: NestJS 모듈 구조, 가드/데코레이터 설계
    - `security`: AES 암호화, RBAC 구현, PII 마스킹

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (단독)
  - **Blocks**: Tasks 2-15
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `packages/missionary-server/src/auth/guards/jwt-auth.guard.ts` — 기존 Guard 패턴 참조
  - `packages/missionary-server/src/common/filters/http-exception.filter.ts` — 기존 공통 모듈 패턴
  - `packages/missionary-server/src/database/prisma.service.ts` — PrismaService 패턴

  **External References**:
  - Spring `AesEncryptConverter.java` (참조: `/Users/JuChan/Documents/FE/missionary-api/src/main/java/com/samill/missionary_backend/common/util/AesEncryptConverter.java`) — AES 암호화 로직. key의 첫 16바이트를 key와 IV 모두로 사용. AES/CBC/PKCS5Padding.
  - Spring `MaskingUtil.java` (참조: `/Users/JuChan/Documents/FE/missionary-api/src/main/java/com/samill/missionary_backend/common/util/MaskingUtil.java`) — 마스킹 로직
  - Spring `SecurityConfig.java` (참조: `/Users/JuChan/Documents/FE/missionary-api/src/main/java/com/samill/missionary_backend/authentication/security/SecurityConfig.java`) — 보안 설정
  - NestJS RBAC 공식 문서: https://docs.nestjs.com/security/authorization
  - prisma-extension-soft-delete: https://github.com/olivierwilkinson/prisma-extension-soft-delete

  **Acceptance Criteria**:

  **TDD:**
  - [ ] `pnpm --filter missionary-server test src/common/utils/encryption.spec.ts` → PASS
  - [ ] `pnpm --filter missionary-server test src/common/guards/roles.guard.spec.ts` → PASS
  - [ ] `pnpm --filter missionary-server test src/common/interceptors/masking.interceptor.spec.ts` → PASS

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Jest test runner works
    Tool: Bash
    Steps:
      1. pnpm --filter missionary-server test --passWithNoTests
      2. Assert: exit code 0
    Expected Result: Jest runs successfully
    Evidence: Terminal output captured

  Scenario: AES encryption round-trip
    Tool: Bash (jest)
    Steps:
      1. Test encrypts "1234567890" with known key
      2. Test decrypts result back
      3. Assert: decrypted === "1234567890"
    Expected Result: Encryption/decryption works
    Evidence: Test output

  Scenario: RBAC guard blocks unauthorized role
    Tool: Bash (jest)
    Steps:
      1. Test creates mock execution context with USER role
      2. Test sets @Roles(ADMIN) on handler
      3. Assert: guard.canActivate() returns false
    Expected Result: Guard correctly blocks unauthorized access
    Evidence: Test output
  ```

  **Commit**: YES
  - Message: `feat(server): add common infrastructure (RBAC, soft delete, audit, encryption, masking)`
  - Files: `src/common/`, `package.json`
  - Pre-commit: `pnpm --filter missionary-server test`

---

- [x] 2. Prisma Schema 전면 재설계

  **What to do**:
  - `prisma/schema.prisma` 전면 재작성 — missionary-api의 모든 엔티티 반영
  - DB 리셋: `prisma migrate reset` (테스트 데이터만 있으므로 안전)
  - 새 마이그레이션 생성: `prisma migrate dev --name full_schema_redesign`
  - `prisma generate` 실행 확인

  **스키마 설계 원칙**:
  - 모든 PK: UUID (`@default(uuid())`)
  - 임베디드 객체 → 플래트 컬럼 (Period → startDate, endDate)
  - Soft Delete 대상 모델: deletedAt 필드 추가
  - Audit 필드: createdAt, updatedAt, createdBy, updatedBy, version
  - `@@map("snake_case_table_name")` + `@map("snake_case_column")`

  **모델 목록** (Spring 매핑):
  1. `User` — Spring의 Member+User+Admin 통합. role enum(USER, ADMIN, STAFF). PII 필드 추가 (identityNumber, phoneNumber, birthDate, gender, isBaptized, baptizedAt). provider/providerId 유지.
  2. `MissionaryRegion` — name, type(DOMESTIC, ABROAD)
  3. `Missionary` — name, startDate, endDate, pastorName, pastorPhone, participationStartDate, participationEndDate, price, description, maximumParticipantCount, currentParticipantCount, bankAccount\* (3 컬럼), regionId FK, createdById FK
  4. `MissionaryPoster` — missionaryId FK, name, path
  5. `MissionaryStaff` — missionaryId FK, userId FK, role(LEADER, MEMBER), unique(missionaryId, userId)
  6. `MissionaryChurch` — missionaryId FK, name, visitPurpose, pastorName, pastorPhone, addressBasic, addressDetail
  7. `MissionaryBoard` — missionaryId FK, type(NOTICE, BUS, ACCOMMODATION, FAQ, SCHEDULE), title, content
  8. `MissionaryBoardFile` — boardId FK, name, path
  9. `Participation` — missionaryId FK, userId FK, teamId FK, name, birthDate, applyFee, isPaid, identificationNumber(AES), isOwnCar
  10. `Team` — missionaryId FK, churchId FK, leaderUserId FK, leaderUserName, teamName
  11. `TeamMember` — teamId FK, userId FK
  12. `Church` — name, pastorName, pastorPhone, addressBasic, addressDetail
  13. `Terms` — termsType, termsUrl, isUsed, termsTitle, seq, isEssential, termsDescription
  14. `TermsContent` — termsId FK, content details
  15. `UserTermsAgreement` — userId FK, termsId FK

  **Enum 목록**:
  - `AuthProvider`: LOCAL, GOOGLE, KAKAO
  - `UserRole`: USER, ADMIN, STAFF
  - `MissionaryRegionType`: DOMESTIC, ABROAD
  - `MissionaryBoardType`: NOTICE, BUS, ACCOMMODATION, FAQ, SCHEDULE
  - `MissionaryStaffRole`: LEADER, MEMBER
  - `MissionStatus`: RECRUITING, IN_PROGRESS, COMPLETED
  - `VisitPurposeType`: (Spring의 MissionaryChurch.visitPurpose 참조)
  - `TermsType`: (Spring의 TermsType 참조)

  **Must NOT do**:
  - 서비스/컨트롤러 구현
  - JSON 컬럼 사용 (반드시 플래트 컬럼)
  - 기존 Int ID 유지

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`api-design`]
    - `api-design`: 스키마 설계, DTO 구조, 관계 매핑

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (단독)
  - **Blocks**: Tasks 3-15
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `packages/missionary-server/prisma/schema.prisma` — 현재 스키마 (리셋 대상)

  **External References** (Spring 엔티티 — 모두 `/Users/JuChan/Documents/FE/missionary-api/src/main/java/com/samill/missionary_backend/` 하위):
  - `member/member/entity/Member.java` — Member 베이스 엔티티
  - `member/user/entity/User.java` — User 엔티티 (PII 필드)
  - `member/admin/entity/Admin.java` — Admin 엔티티
  - `missionary/missionary/entity/Missionary.java` — Missionary 엔티티 + MissionaryDetail, BankAccount 임베디드
  - `missionary/missionary/entity/MissionaryPoster.java` — 포스터 엔티티
  - `missionary/staff/entity/MissionaryStaff.java` — 스탭 엔티티
  - `missionary/church/entity/MissionaryChurch.java` — 선교교회 엔티티
  - `missionary/board/entity/MissionaryBoard.java` — 게시판 엔티티 + MissionaryBoardFile
  - `missionary/participation/entity/Participation.java` — 참가 엔티티
  - `missionary/team/entity/Team.java`, `TeamMember.java` — 팀 엔티티
  - `missionary/region/entity/MissionaryRegion.java` — 지역 엔티티
  - `church/church/entity/Church.java` — 교회 엔티티
  - `terms/entity/Terms.java`, `TermsContent.java`, `UserTermsAgreement.java` — 약관 엔티티
  - `common/entity/BaseEntity.java` — 감사 필드 (createdAt, updatedAt, createdBy, updatedBy, version)
  - `common/entity/Period.java`, `Pastor.java`, `Address.java` — 임베디드 값 객체

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Prisma schema validates
    Tool: Bash
    Steps:
      1. pnpm --filter missionary-server prisma validate
      2. Assert: exit code 0
    Expected Result: Schema is valid
    Evidence: Terminal output

  Scenario: Migration applies successfully
    Tool: Bash
    Steps:
      1. pnpm --filter missionary-server prisma migrate reset --force
      2. pnpm --filter missionary-server prisma migrate dev --name full_schema_redesign
      3. Assert: exit code 0
    Expected Result: Migration created and applied
    Evidence: Terminal output

  Scenario: Prisma client generates
    Tool: Bash
    Steps:
      1. pnpm --filter missionary-server prisma:generate
      2. Assert: exit code 0
    Expected Result: Client generated with all new models
    Evidence: Terminal output

  Scenario: Type check passes with new schema
    Tool: Bash
    Steps:
      1. pnpm type-check
      2. Assert: exit code 0
    Expected Result: No type errors
    Evidence: Terminal output
  ```

  **Commit**: YES
  - Message: `feat(server): redesign Prisma schema with full domain models (UUID, soft delete, audit)`
  - Files: `prisma/schema.prisma`, `prisma/migrations/`
  - Pre-commit: `pnpm --filter missionary-server prisma validate`

---

- [x] 3. User Module 리팩터링 (UUID + 확장 필드)

  **What to do**:
  - `user.service.ts` — UUID 기반으로 CRUD 수정, PII 필드 지원
  - `user.controller.ts` — RBAC 적용 (관리자만 유저 목록 조회 등)
  - `dto/create-user.dto.ts` — 확장 필드 추가 (phoneNumber, birthDate, gender 등)
  - `dto/update-user.dto.ts` — 확장 필드 추가
  - TDD: 각 서비스 메서드에 대한 단위 테스트

  **Must NOT do**:
  - Auth 모듈 변경 (Task 4에서)
  - 다른 도메인 모듈 구현

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 4)
  - **Blocks**: Tasks 7, 8, 9, 10
  - **Blocked By**: Task 2

  **References**:
  - `packages/missionary-server/src/user/` — 현재 User 모듈
  - Spring `member/user/entity/User.java` — PII 필드 목록
  - Spring `member/dto/` — DTO 필드 참조
  - Spring `gateway/management/UserGatewayManagement.java` — User API 엔드포인트 참조

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/user/` → PASS
  - [ ] `pnpm type-check` → Exit 0

  ```
  Scenario: Create user with extended fields
    Tool: Bash (curl)
    Steps:
      1. POST /users with { email, name, phoneNumber, birthDate, gender }
      2. Assert: status 201
      3. Assert: response.id is UUID format
      4. GET /users/{id} → Assert all fields present
    Expected Result: User created with all PII fields
    Evidence: Response body captured
  ```

  **Commit**: YES
  - Message: `refactor(server): update User module to UUID with extended PII fields`
  - Files: `src/user/`

---

- [x] 4. Auth Module RBAC 확장

  **What to do**:
  - JWT payload에 role 필드 추가 (sub를 UUID string으로 변경)
  - `AuthService` — 토큰 생성 시 role 포함
  - 글로벌 RolesGuard 등록 (`APP_GUARD`)
  - `@Roles()` 데코레이터를 기존 엔드포인트에 적용
  - Admin 전용 엔드포인트 생성 (Admin 로그인: loginId/password 기반)
  - TDD: 역할별 접근 제어 테스트

  **Must NOT do**:
  - OAuth 플로우 변경
  - 새 도메인 모듈 구현

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`security`, `api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 3)
  - **Blocks**: Tasks 5-15
  - **Blocked By**: Task 2

  **References**:
  - `packages/missionary-server/src/auth/` — 현재 Auth 모듈
  - `src/common/decorators/roles.decorator.ts` — Task 1에서 생성
  - `src/common/guards/roles.guard.ts` — Task 1에서 생성
  - Spring `authentication/security/SecurityConfig.java` — 보안 설정
  - Spring `token/provider/TokenProvider.java` — JWT 토큰 생성
  - Spring `gateway/management/AdminGatewayManagement.java` — Admin 로그인 엔드포인트

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/auth/` → PASS

  ```
  Scenario: RBAC blocks USER from admin endpoint
    Tool: Bash (curl)
    Steps:
      1. Login as USER → get access_token cookie
      2. GET /users (admin-only) with USER token
      3. Assert: status 403
    Expected Result: Forbidden for non-admin users
    Evidence: Response body captured

  Scenario: RBAC allows ADMIN access
    Tool: Bash (curl)
    Steps:
      1. Login as ADMIN → get access_token cookie
      2. GET /users with ADMIN token
      3. Assert: status 200
    Expected Result: Admin can access admin endpoints
    Evidence: Response body captured
  ```

  **Commit**: YES
  - Message: `feat(server): extend Auth module with RBAC and UUID-based JWT`
  - Files: `src/auth/`

---

- [x] 5. Region Module (MissionaryRegion)

  **What to do**:
  - `src/region/region.module.ts`, `region.controller.ts`, `region.service.ts`
  - `dto/create-region.dto.ts`, `dto/update-region.dto.ts`
  - CRUD: 지역 생성/조회/수정/삭제 (Admin 전용)
  - TDD

  **Must NOT do**: Missionary와의 연관 로직 (Task 7에서)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 6)
  - **Blocks**: Task 7
  - **Blocked By**: Task 4

  **References**:
  - Spring `missionary/region/entity/MissionaryRegion.java` — 엔티티
  - Spring `missionary/region/service/MissionaryRegionServiceImpl.java` — 서비스
  - Spring `gateway/endPoint/AdminGatewayManagementEndPoint.java` — 엔드포인트 경로

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/region/` → PASS

  ```
  Scenario: CRUD Region
    Tool: Bash (curl)
    Steps:
      1. POST /regions { name: "서울", type: "DOMESTIC" } → Assert 201, UUID id
      2. GET /regions → Assert array contains created region
      3. PUT /regions/{id} { name: "부산" } → Assert 200
      4. DELETE /regions/{id} → Assert 200
      5. GET /regions → Assert deleted region not in list
    Expected Result: Full CRUD cycle works
    Evidence: Response bodies captured
  ```

  **Commit**: YES
  - Message: `feat(server): add Region module with CRUD endpoints`
  - Files: `src/region/`

---

- [x] 6. Church Module

  **What to do**:
  - `src/church/church.module.ts`, `church.controller.ts`, `church.service.ts`
  - `dto/create-church.dto.ts`, `dto/update-church.dto.ts`
  - CRUD: 교회 생성/조회/수정/삭제
  - Admin + Staff 접근 가능
  - TDD

  **Must NOT do**: MissionaryChurch 관련 로직 (Task 7에서)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 5)
  - **Blocks**: Task 7
  - **Blocked By**: Task 4

  **References**:
  - Spring `church/church/entity/Church.java` — 엔티티 (pastor + address 임베디드)
  - Spring `church/church/service/ChurchService.java` — 서비스
  - Spring `gateway/management/AdminGatewayManagement.java` — Church CRUD 엔드포인트

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/church/` → PASS

  ```
  Scenario: CRUD Church
    Tool: Bash (curl)
    Steps:
      1. POST /churches { name, pastorName, pastorPhone, addressBasic, addressDetail } → 201
      2. GET /churches → array includes new church
      3. PUT /churches/{id} → 200
      4. DELETE /churches/{id} → soft delete, GET returns empty
    Expected Result: Full CRUD with soft delete
    Evidence: Response bodies
  ```

  **Commit**: YES
  - Message: `feat(server): add Church module with CRUD endpoints`
  - Files: `src/church/`

---

- [x] 7. Missionary Module 리팩터링

  **What to do**:
  - 기존 `src/mission/` → `src/missionary/`로 리네임 (Spring 명명 일치)
  - `missionary.service.ts` — 확장 필드 (pastorPhone, participation기간, price, bankAccount 등)
  - `missionary.controller.ts` — Region 연관, Poster/Church 하위 리소스
  - DTO 전면 재작성 (Spring의 CreateMissionaryRequest, UpdateAdminMissionaryRequest 참조)
  - MissionaryChurch 하위 CRUD (선교 교회 방문 관리)
  - MissionaryPoster 하위 CRUD (포스터 메타데이터만, 실제 업로드 제외)
  - TDD

  **Must NOT do**:
  - Participation 로직 (Task 8)
  - Staff 로직 (Task 9)
  - Board 로직 (Task 11)
  - 파일 업로드 구현

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (단독)
  - **Blocks**: Tasks 8, 9, 11
  - **Blocked By**: Tasks 3, 5, 6

  **References**:
  - `packages/missionary-server/src/mission/` — 현재 Mission 모듈 (리팩터링 대상)
  - Spring `missionary/missionary/entity/Missionary.java` — 엔티티 + MissionaryDetail, BankAccount
  - Spring `missionary/missionary/entity/MissionaryPoster.java` — 포스터
  - Spring `missionary/church/entity/MissionaryChurch.java` — 선교교회
  - Spring `missionary/dto/` — 20+ DTO 클래스
  - Spring `gateway/management/admin/AdminMissionaryGatewayManagement.java` — Admin 선교 관리 API
  - Spring `gateway/management/UserGatewayManagement.java` — User 선교 조회 API

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/missionary/` → PASS

  ```
  Scenario: Create missionary with full details
    Tool: Bash (curl)
    Steps:
      1. POST /missionaries with all fields (name, dates, pastor, participation period, price, bank account, regionId)
      2. Assert: status 201, UUID id
      3. GET /missionaries/{id} → Assert all fields returned including region
    Expected Result: Missionary created with expanded schema
    Evidence: Response bodies

  Scenario: Missionary soft delete
    Tool: Bash (curl)
    Steps:
      1. DELETE /missionaries/{id}
      2. GET /missionaries/{id} → Assert 404
      3. Direct DB query: SELECT deleted_at FROM missionaries WHERE id = '{id}' → NOT NULL
    Expected Result: Soft deleted, not physically removed
    Evidence: Response + DB query result
  ```

  **Commit**: YES
  - Message: `refactor(server): expand Missionary module with full domain fields and sub-resources`
  - Files: `src/missionary/`

---

- [x] 8. Participation Module + BullMQ

  **What to do**:
  - `src/participation/participation.module.ts`, `participation.controller.ts`, `participation.service.ts`
  - `src/participation/participation.processor.ts` — BullMQ 프로세서 (비동기 참가 생성)
  - Redis + BullMQ 설정 (`src/common/queue/bull.module.ts`)
  - 참가 신청 CRUD (User: 생성/수정/삭제, Admin/Staff: 목록/상세/결제승인)
  - 참가자 수 관리 (Redis atomic counter로 currentParticipantCount)
  - 참가자 수 제한 검증 (maximumParticipantCount 초과 방지)
  - AES 암호화 적용 (identificationNumber 필드)
  - TDD

  **Must NOT do**:
  - Team 연관 로직 (Task 10에서)
  - CSV export (Task 13에서)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`api-design`, `security`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Task 9)
  - **Blocks**: Tasks 10, 13, 14
  - **Blocked By**: Task 7

  **References**:
  - Spring `missionary/participation/entity/Participation.java` — 엔티티 (AES 암호화 필드)
  - Spring `missionary/participation/service/ParticipationServiceImpl.java` — 비즈니스 로직 (RabbitMQ 통합)
  - Spring `missionary/participation/service/RabbitMqProducer.java`, `RabbitMqConsumer.java` — 메시지 큐
  - Spring `configs/RabbitMqConfig.java` — 큐 설정
  - Spring `common/util/AesEncryptConverter.java` — 암호화 로직
  - Spring `gateway/management/AdminGatewayManagement.java` — 참가 관리 API (목록, 승인)

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/participation/` → PASS

  ```
  Scenario: Create participation with encrypted identificationNumber
    Tool: Bash (curl)
    Steps:
      1. POST /participations { missionaryId, name, birthDate, applyFee, identificationNumber, isOwnCar }
      2. Assert: status 201
      3. Direct DB query: SELECT identification_number FROM participations WHERE id = '{id}'
      4. Assert: DB value is NOT the plain text (encrypted)
      5. GET /participations/{id} → Assert identificationNumber is masked (******)
    Expected Result: PII encrypted in DB, masked in API response
    Evidence: Response + DB query

  Scenario: Participation count limit enforcement
    Tool: Bash (curl)
    Steps:
      1. Create missionary with maximumParticipantCount = 1
      2. POST /participations (first) → Assert 201
      3. POST /participations (second) → Assert 409 or 400
    Expected Result: Second registration rejected due to capacity
    Evidence: Response bodies

  Scenario: Admin approves payment
    Tool: Bash (curl)
    Steps:
      1. PUT /participations/approve { participationIds: [...] } as ADMIN
      2. GET /participations/{id} → Assert isPaid = true
    Expected Result: Payment status updated
    Evidence: Response bodies
  ```

  **Commit**: YES
  - Message: `feat(server): add Participation module with BullMQ, AES encryption, and capacity management`
  - Files: `src/participation/`, `src/common/queue/`

---

- [x] 9. Staff Module (MissionaryStaff)

  **What to do**:
  - `src/staff/staff.module.ts`, `staff.controller.ts`, `staff.service.ts`
  - 스탭 지정/해제 (Admin 전용)
  - 선교별 스탭 목록 조회
  - unique(missionaryId, userId) 검증
  - TDD

  **Must NOT do**: Team 로직 (Task 10)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Task 8)
  - **Blocks**: None
  - **Blocked By**: Task 7

  **References**:
  - Spring `missionary/staff/entity/MissionaryStaff.java` — 엔티티
  - Spring `missionary/staff/service/MissionaryStaffService.java` — 서비스
  - Spring `gateway/endPoint/AdminGatewayManagementEndPoint.java` — Staff API 경로

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/staff/` → PASS

  ```
  Scenario: Appoint and disappoint staff
    Tool: Bash (curl)
    Steps:
      1. POST /missionaries/{id}/staffs { userIds, role: "LEADER" } → 201
      2. GET /missionaries/{id}/staffs → Assert contains appointed user
      3. DELETE /missionaries/{id}/staffs { userIds } → 200
      4. GET /missionaries/{id}/staffs → Assert removed
    Expected Result: Staff lifecycle works
    Evidence: Response bodies
  ```

  **Commit**: YES
  - Message: `feat(server): add Staff module for missionary staff management`
  - Files: `src/staff/`

---

- [x] 10. Team Module

  **What to do**:
  - `src/team/team.module.ts`, `team.controller.ts`, `team.service.ts`
  - 팀 CRUD (Staff/Admin)
  - 팀 멤버 관리 (추가/제거)
  - 팀 리더 지정
  - TDD

  **Must NOT do**: 참가자와 팀 자동 연결 (수동 할당)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 7 (단독)
  - **Blocks**: Tasks 13
  - **Blocked By**: Task 8

  **References**:
  - Spring `missionary/team/entity/Team.java`, `TeamMember.java` — 엔티티
  - Spring `missionary/team/service/TeamServiceImpl.java` — 서비스
  - Spring `gateway/management/StaffGatewayManagement.java` — Team API

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/team/` → PASS

  ```
  Scenario: Team CRUD with members
    Tool: Bash (curl)
    Steps:
      1. POST /teams { missionaryId, churchId, leaderUserId, teamName } → 201
      2. PUT /teams/{id}/members { userIds: [...] } → 200
      3. GET /teams/{id} → Assert members list populated
      4. DELETE /teams/{id} → soft delete
    Expected Result: Team with members managed
    Evidence: Response bodies
  ```

  **Commit**: YES
  - Message: `feat(server): add Team module with member management`
  - Files: `src/team/`

---

- [x] 11. Board Module (MissionaryBoard)

  **What to do**:
  - `src/board/board.module.ts`, `board.controller.ts`, `board.service.ts`
  - 게시판 CRUD (타입별: NOTICE, BUS, ACCOMMODATION, FAQ, SCHEDULE)
  - 역할별 접근 제어 (Admin: 전체, Staff: 담당 선교만, User: 참가 선교만)
  - BoardFile 메타데이터만 관리 (실제 파일 업로드는 후속)
  - TDD

  **Must NOT do**:
  - 파일 업로드/다운로드 구현
  - 파일 스토리지 연동 (S3, local 등)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`api-design`, `security`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 8 (with Task 12)
  - **Blocks**: None
  - **Blocked By**: Task 7

  **References**:
  - Spring `missionary/board/entity/MissionaryBoard.java`, `MissionaryBoardFile.java` — 엔티티
  - Spring `missionary/board/service/MissionaryBoardService.java` — 서비스
  - Spring `missionary/board/module/` — Strategy 패턴 (Admin/Staff/User별)
  - Spring `missionary/enums/MissionaryBoardType.java` — 게시판 타입

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/board/` → PASS

  ```
  Scenario: CRUD board by type
    Tool: Bash (curl)
    Steps:
      1. POST /missionaries/{id}/boards { type: "NOTICE", title, content } → 201
      2. GET /missionaries/{id}/boards?type=NOTICE → Assert contains posted board
      3. PUT /boards/{boardId} → 200
      4. DELETE /boards/{boardId} → soft delete
    Expected Result: Board CRUD with type filtering
    Evidence: Response bodies
  ```

  **Commit**: YES
  - Message: `feat(server): add Board module for missionary notices and information`
  - Files: `src/board/`

---

- [x] 12. Terms Module

  **What to do**:
  - `src/terms/terms.module.ts`, `terms.controller.ts`, `terms.service.ts`
  - 약관 CRUD (Admin)
  - 약관 동의 관리 (UserTermsAgreement)
  - 사용자별 동의 기록 조회
  - TDD

  **Must NOT do**: 회원가입 플로우 변경

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 8 (with Task 11)
  - **Blocks**: None
  - **Blocked By**: Task 4

  **References**:
  - Spring `terms/entity/Terms.java`, `TermsContent.java`, `UserTermsAgreement.java` — 엔티티
  - Spring `terms/service/TermsService.java` — 서비스

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/terms/` → PASS

  ```
  Scenario: Terms agreement lifecycle
    Tool: Bash (curl)
    Steps:
      1. POST /terms { termsType, title, url, isEssential } as ADMIN → 201
      2. GET /terms → list of terms
      3. POST /terms/{termsId}/agreements as USER → 201 (agreement created)
      4. GET /users/{userId}/terms-agreements → contains the agreement
    Expected Result: Terms created and user agreement recorded
    Evidence: Response bodies
  ```

  **Commit**: YES
  - Message: `feat(server): add Terms module with agreement tracking`
  - Files: `src/terms/`

---

- [x] 13. CSV Export

  **What to do**:
  - `src/common/csv/csv-export.service.ts` — fast-csv 기반 CSV 생성
  - `src/participation/participation.controller.ts`에 다운로드 엔드포인트 추가
  - UTF-8 BOM 포함 (한글 호환)
  - Admin/Staff 전용
  - TDD

  **Must NOT do**: 다른 도메인의 CSV export

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 9 (with Task 14)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 8, 10

  **References**:
  - Spring `gateway/management/AdminGatewayManagement.java` — CSV download 엔드포인트
  - Spring 사용 라이브러리: OpenCSV with UTF-8 BOM

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/common/csv/` → PASS

  ```
  Scenario: Download participation CSV
    Tool: Bash (curl)
    Steps:
      1. GET /participations/download/{missionaryId} as ADMIN
      2. Assert: Content-Type is text/csv
      3. Assert: Response starts with UTF-8 BOM (EF BB BF)
      4. Assert: CSV headers include name, birthDate, applyFee, isPaid
    Expected Result: Valid CSV with Korean support
    Evidence: Response saved to file
  ```

  **Commit**: YES
  - Message: `feat(server): add CSV export for participation data`
  - Files: `src/common/csv/`, `src/participation/`

---

- [x] 14. PII Scheduler (@nestjs/schedule)

  **What to do**:
  - `src/common/scheduler/pii-cleanup.service.ts`
  - @nestjs/schedule의 `@Cron()` 데코레이터로 일일 실행
  - 선교 종료 후 7일 지난 참가자의 identificationNumber 클리어
  - ScheduleModule 등록
  - TDD

  **Must NOT do**: 다른 스케줄 작업 추가

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 9 (with Task 13)
  - **Blocks**: Task 15
  - **Blocked By**: Task 8

  **References**:
  - Spring `missionary/participation/scheduler/ParticipationScheduler.java` — 스케줄러 로직
  - NestJS Schedule: https://docs.nestjs.com/techniques/task-scheduling

  **Acceptance Criteria**:
  - [ ] `pnpm --filter missionary-server test src/common/scheduler/` → PASS

  ```
  Scenario: PII cleanup removes old identification numbers
    Tool: Bash (jest)
    Steps:
      1. Create test participation with identificationNumber and missionary ended 8 days ago
      2. Run cleanup service manually in test
      3. Assert: identificationNumber is null/empty after cleanup
    Expected Result: PII cleared for old participations
    Evidence: Test output
  ```

  **Commit**: YES
  - Message: `feat(server): add PII cleanup scheduler for expired participations`
  - Files: `src/common/scheduler/`

---

- [x] 15. Integration 검증 + Swagger 정리

  **What to do**:
  - 전체 모듈 통합 테스트 (E2E)
  - Swagger API 문서 정리 (@ApiTags, @ApiOperation, @ApiResponse)
  - AppModule에 모든 모듈 등록 확인
  - CORS 설정 확인 (admin, app 클라이언트)
  - 전체 빌드 + 타입 체크 + 테스트 통과 확인
  - `app.module.ts` 최종 정리

  **Must NOT do**: 새 기능 추가, 프론트엔드 작업

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`api-design`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 10 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 1-14

  **References**:
  - `packages/missionary-server/src/app.module.ts` — 루트 모듈
  - `packages/missionary-server/src/main.ts` — 앱 부트스트랩
  - Spring `gateway/endPoint/` — 모든 엔드포인트 경로 목록

  **Acceptance Criteria**:

  ```
  Scenario: Full build succeeds
    Tool: Bash
    Steps:
      1. pnpm build:server
      2. Assert: exit code 0
    Expected Result: Server builds without errors
    Evidence: Terminal output

  Scenario: All tests pass
    Tool: Bash
    Steps:
      1. pnpm --filter missionary-server test
      2. Assert: exit code 0, 0 failures
    Expected Result: All unit tests pass
    Evidence: Test summary output

  Scenario: Type check passes
    Tool: Bash
    Steps:
      1. pnpm type-check
      2. Assert: exit code 0
    Expected Result: No type errors
    Evidence: Terminal output

  Scenario: Swagger docs complete
    Tool: Bash (curl)
    Steps:
      1. Start dev server
      2. curl http://localhost:3100/api-docs-json | jq '.paths | keys'
      3. Assert: Contains /missionaries, /participations, /teams, /churches, /regions, /staffs, /boards, /terms
    Expected Result: All endpoints documented
    Evidence: Swagger JSON paths

  Scenario: Server health check
    Tool: Bash (curl)
    Steps:
      1. curl http://localhost:3100/health
      2. Assert: { "status": "ok" }
    Expected Result: Server running and healthy
    Evidence: Response body
  ```

  **Commit**: YES
  - Message: `chore(server): finalize integration, Swagger docs, and module registration`
  - Files: `src/app.module.ts`, `src/main.ts`

---

## Commit Strategy

| After Task | Message                                      | Key Files               | Verification      |
| ---------- | -------------------------------------------- | ----------------------- | ----------------- |
| 1          | `feat(server): add common infrastructure`    | `src/common/`           | `test`            |
| 2          | `feat(server): redesign Prisma schema`       | `prisma/`               | `prisma validate` |
| 3          | `refactor(server): update User module`       | `src/user/`             | `test`            |
| 4          | `feat(server): extend Auth with RBAC`        | `src/auth/`             | `test`            |
| 5          | `feat(server): add Region module`            | `src/region/`           | `test`            |
| 6          | `feat(server): add Church module`            | `src/church/`           | `test`            |
| 7          | `refactor(server): expand Missionary module` | `src/missionary/`       | `test`            |
| 8          | `feat(server): add Participation + BullMQ`   | `src/participation/`    | `test`            |
| 9          | `feat(server): add Staff module`             | `src/staff/`            | `test`            |
| 10         | `feat(server): add Team module`              | `src/team/`             | `test`            |
| 11         | `feat(server): add Board module`             | `src/board/`            | `test`            |
| 12         | `feat(server): add Terms module`             | `src/terms/`            | `test`            |
| 13         | `feat(server): add CSV export`               | `src/common/csv/`       | `test`            |
| 14         | `feat(server): add PII scheduler`            | `src/common/scheduler/` | `test`            |
| 15         | `chore(server): finalize integration`        | `src/app.module.ts`     | `build + test`    |

---

## Success Criteria

### Verification Commands

```bash
pnpm --filter missionary-server prisma validate   # Exit 0
pnpm --filter missionary-server prisma:generate    # Exit 0
pnpm type-check                                     # Exit 0
pnpm build:server                                   # Exit 0
pnpm --filter missionary-server test               # All tests pass, 0 failures
```

### Final Checklist

- [x] 전체 Prisma 스키마 (15+ 모델) 정의 및 마이그레이션 완료
- [x] 모든 Spring API 엔드포인트에 대응하는 NestJS 엔드포인트 존재
- [x] RBAC (USER, ADMIN, STAFF) 동작 확인
- [x] Soft Delete 전체 적용 및 동작 확인
- [x] Audit Trail (createdBy, updatedBy, version) 자동 설정 확인
- [x] AES 암호화/복호화 동작 확인
- [x] PII 마스킹 API 응답에서 동작 확인
- [x] BullMQ 비동기 참가 처리 동작 확인
- [x] CSV export UTF-8 BOM 포함 확인
- [x] PII Scheduler 동작 확인
- [x] Swagger 전체 엔드포인트 문서화
- [x] 모든 테스트 통과
