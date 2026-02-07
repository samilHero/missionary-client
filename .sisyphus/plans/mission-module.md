# Mission 모듈 구현

## TL;DR

> **Quick Summary**: 선교 생성/관리 기능을 위한 Mission 모듈 구현. Prisma 스키마, NestJS CRUD API, 선교별 멤버 역할 관리 포함.
>
> **Deliverables**:
>
> - Prisma schema에 Mission, MissionMember 모델 추가
> - MissionModule (Controller, Service, DTOs)
> - 선교 생성 시 LEADER 자동 등록 로직
>
> **Estimated Effort**: Medium
> **Parallel Execution**: NO - sequential (DB 마이그레이션 → 모듈 구현)
> **Critical Path**: Schema → Migrate → DTOs → Service → Controller → Module 등록

---

## Context

### Original Request

선교 생성 페이지를 위한 BE 작업. 필드: 선교 이름, 선교 기간(시작일~종료일), 담당 교역자.

### Interview Summary

**Key Discussions**:

- 담당 교역자 = 목사님 = SUPER_ADMIN 역할
- 한 유저가 A선교에서 참가자, B선교에서 관리자 가능 → MissionMember 테이블 필요
- 선교 유형(국내/해외) 구분 필요

**Research Findings**:

- 기존 Java API (missionary-api) 분석 완료
- MissionaryStaff 패턴을 NestJS MissionMember로 전환
- Period Embedded → startDate/endDate 필드로 변환

---

## Work Objectives

### Core Objective

선교(Mission) CRUD API와 선교별 멤버 역할 관리 기능 구현

### Concrete Deliverables

- `prisma/schema.prisma`: Mission, MissionMember 모델
- `src/mission/mission.module.ts`
- `src/mission/mission.controller.ts`
- `src/mission/mission.service.ts`
- `src/mission/dto/create-mission.dto.ts`
- `src/mission/dto/update-mission.dto.ts`

### Definition of Done

- [x] `pnpm --filter missionary-server prisma:migrate:dev` 성공
- [x] `pnpm --filter missionary-server build` 성공
- [x] POST /missions API로 선교 생성 가능
- [x] 생성 시 현재 유저가 LEADER로 자동 등록

### Must Have

- Mission CRUD (Create, Read, Update, Delete)
- MissionMember 관계 테이블
- 선교 유형 (DOMESTIC/OVERSEAS) enum
- 선교 상태 (RECRUITING/IN_PROGRESS/COMPLETED) enum
- 담당 교역자 정보 (pastorName)

### Must NOT Have (Guardrails)

- 참가 신청 기능 (별도 모듈로 분리)
- 팀 관리 기능 (추후 구현)
- 복잡한 권한 체크 Guard (MVP에서는 기본만)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
> 모든 검증은 에이전트가 명령어로 수행

### Test Decision

- **Infrastructure exists**: YES (기존 NestJS 구조)
- **Automated tests**: NO (MVP 단계, 추후 추가)
- **Framework**: N/A

### Agent-Executed QA Scenarios

**Verification Tool by Deliverable Type:**

| Type         | Tool        | How Agent Verifies                        |
| ------------ | ----------- | ----------------------------------------- |
| DB Migration | Bash        | `prisma migrate dev` 실행, 에러 없음 확인 |
| Build        | Bash        | `pnpm build:server` 성공 확인             |
| API          | Bash (curl) | POST/GET 요청으로 CRUD 동작 확인          |

---

## TODOs

- [x] 1. Prisma Schema에 Mission 관련 모델 추가

  **What to do**:
  - `prisma/schema.prisma`에 enum 추가: `MissionType`, `MissionStatus`, `MissionMemberRole`
  - `Mission` 모델 추가
  - `MissionMember` 모델 추가 (선교-유저 관계)
  - `User` 모델에 relations 추가

  **Must NOT do**:
  - 기존 User, AuthProvider, UserRole 수정하지 않음

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 2, 3, 4, 5, 6
  - **Blocked By**: None

  **References**:
  - `packages/missionary-server/prisma/schema.prisma` - 기존 스키마 패턴 (User 모델 참고)
  - Java API `MissionaryStaff` 엔티티 패턴

  **Schema to Add**:

  ```prisma
  enum MissionType {
    DOMESTIC
    OVERSEAS
  }

  enum MissionStatus {
    RECRUITING
    IN_PROGRESS
    COMPLETED
  }

  enum MissionMemberRole {
    LEADER
    STAFF
    PARTICIPANT
  }

  model Mission {
    id          Int             @id @default(autoincrement())
    name        String
    type        MissionType
    status      MissionStatus   @default(RECRUITING)
    startDate   DateTime        @map("start_date")
    endDate     DateTime        @map("end_date")
    pastorName  String          @map("pastor_name")

    createdBy   User            @relation("createdMissions", fields: [createdById], references: [id])
    createdById Int             @map("created_by_id")

    members     MissionMember[]

    createdAt   DateTime        @default(now()) @map("created_at")
    updatedAt   DateTime        @updatedAt @map("updated_at")

    @@map("missions")
  }

  model MissionMember {
    id         Int                @id @default(autoincrement())
    mission    Mission            @relation(fields: [missionId], references: [id], onDelete: Cascade)
    missionId  Int                @map("mission_id")
    user       User               @relation("missionMembers", fields: [userId], references: [id], onDelete: Cascade)
    userId     Int                @map("user_id")
    role       MissionMemberRole

    createdAt  DateTime           @default(now()) @map("created_at")

    @@unique([missionId, userId])
    @@index([missionId])
    @@index([userId])
    @@map("mission_members")
  }

  // User 모델에 추가할 relations:
  // createdMissions Mission[] @relation("createdMissions")
  // missionMembers  MissionMember[] @relation("missionMembers")
  ```

  **Acceptance Criteria**:
  - [x] schema.prisma 파일에 3개 enum 추가됨
  - [x] Mission 모델 정의됨
  - [x] MissionMember 모델 정의됨
  - [x] User 모델에 relation 추가됨

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Schema validation passes
    Tool: Bash
    Steps:
      1. cd packages/missionary-server
      2. npx prisma validate
    Expected Result: "The schema is valid." 메시지
    Evidence: stdout 캡처
  ```

  **Commit**: YES
  - Message: `feat(server): add Mission and MissionMember schema`
  - Files: `prisma/schema.prisma`

---

- [x] 2. Prisma Migration 실행

  **What to do**:
  - `prisma migrate dev` 실행하여 DB 스키마 반영
  - Prisma Client 재생성

  **Must NOT do**:
  - 프로덕션 DB에 직접 실행하지 않음

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 3, 4, 5, 6
  - **Blocked By**: Task 1

  **References**:
  - `packages/missionary-server/package.json` - prisma 스크립트 확인

  **Acceptance Criteria**:
  - [x] Migration 파일 생성됨 (`prisma/migrations/` 폴더)
  - [x] `prisma generate` 성공

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Migration succeeds
    Tool: Bash
    Preconditions: PostgreSQL 실행 중, .env 설정됨
    Steps:
      1. cd packages/missionary-server
      2. npx prisma migrate dev --name add_mission_model
      3. npx prisma generate
    Expected Result: "Your database is now in sync" 메시지
    Evidence: stdout 캡처

  Scenario: Prisma Client generated
    Tool: Bash
    Steps:
      1. ls packages/missionary-server/prisma/generated/prisma/
    Expected Result: client.d.ts, index.d.ts 등 파일 존재
    Evidence: 파일 목록 캡처
  ```

  **Commit**: YES
  - Message: `chore(server): add mission migration`
  - Files: `prisma/migrations/*`

---

- [x] 3. Mission DTOs 생성

  **What to do**:
  - `src/mission/dto/create-mission.dto.ts` 생성
  - `src/mission/dto/update-mission.dto.ts` 생성
  - class-validator 데코레이터 적용
  - Swagger 문서화

  **Must NOT do**:
  - 과도한 validation (MVP 수준으로)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 4, 5
  - **Blocked By**: Task 2

  **References**:
  - `packages/missionary-server/src/user/dto/create-user.dto.ts` - DTO 패턴 참고

  **DTO Structure**:

  ```typescript
  // create-mission.dto.ts
  export class CreateMissionDto {
    @ApiProperty({ example: '2024 제주선교', description: '선교 이름' })
    @IsString()
    @IsNotEmpty()
    declare name: string;

    @ApiProperty({ enum: ['DOMESTIC', 'OVERSEAS'], description: '선교 유형' })
    @IsEnum(MissionType)
    declare type: MissionType;

    @ApiProperty({ example: '2024-07-01', description: '시작일' })
    @IsDateString()
    declare startDate: string;

    @ApiProperty({ example: '2024-07-07', description: '종료일' })
    @IsDateString()
    declare endDate: string;

    @ApiProperty({ example: '김목사', description: '담당 교역자 이름' })
    @IsString()
    @IsNotEmpty()
    declare pastorName: string;
  }

  // update-mission.dto.ts
  export class UpdateMissionDto extends PartialType(CreateMissionDto) {
    @ApiProperty({
      enum: ['RECRUITING', 'IN_PROGRESS', 'COMPLETED'],
      required: false,
    })
    @IsEnum(MissionStatus)
    @IsOptional()
    declare status?: MissionStatus;
  }
  ```

  **Acceptance Criteria**:
  - [x] create-mission.dto.ts 파일 생성됨
  - [x] update-mission.dto.ts 파일 생성됨
  - [x] class-validator 데코레이터 적용됨
  - [x] ApiProperty 문서화됨

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: DTO files exist with correct exports
    Tool: Bash
    Steps:
      1. cat packages/missionary-server/src/mission/dto/create-mission.dto.ts
      2. grep -q "CreateMissionDto"
    Expected Result: 파일 존재, export 확인
    Evidence: 파일 내용 캡처
  ```

  **Commit**: YES
  - Message: `feat(server): add Mission DTOs`
  - Files: `src/mission/dto/*.ts`

---

- [x] 4. Mission Service 생성

  **What to do**:
  - `src/mission/mission.service.ts` 생성
  - CRUD 메서드 구현 (create, findAll, findOne, update, remove)
  - 선교 생성 시 LEADER 멤버 자동 등록 로직

  **Must NOT do**:
  - 복잡한 비즈니스 로직 (MVP 수준)
  - 권한 체크 (Controller/Guard에서 처리)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 5
  - **Blocked By**: Task 3

  **References**:
  - `packages/missionary-server/src/user/user.service.ts` - Service 패턴 참고
  - `packages/missionary-server/src/database/prisma.service.ts` - Prisma 사용법

  **Service Structure**:

  ```typescript
  @Injectable()
  export class MissionService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, dto: CreateMissionDto) {
      // 1. Mission 생성
      // 2. 생성자를 LEADER로 MissionMember 추가
      return this.prisma.mission.create({
        data: {
          ...dto,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          createdById: userId,
          members: {
            create: {
              userId: userId,
              role: 'LEADER',
            },
          },
        },
        include: { members: true },
      });
    }

    async findAll() {
      /* 전체 조회 */
    }
    async findOne(id: number) {
      /* 단건 조회 */
    }
    async update(id: number, dto: UpdateMissionDto) {
      /* 수정 */
    }
    async remove(id: number) {
      /* 삭제 */
    }
  }
  ```

  **Acceptance Criteria**:
  - [x] mission.service.ts 파일 생성됨
  - [x] create, findAll, findOne, update, remove 메서드 구현
  - [x] create 시 LEADER 멤버 자동 생성 로직 포함
  - [x] PrismaService 주입됨

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Service file compiles without errors
    Tool: Bash
    Steps:
      1. cd packages/missionary-server
      2. npx tsc --noEmit src/mission/mission.service.ts
    Expected Result: 에러 없음
    Evidence: stdout (empty = success)
  ```

  **Commit**: YES
  - Message: `feat(server): add MissionService with CRUD`
  - Files: `src/mission/mission.service.ts`

---

- [x] 5. Mission Controller 생성

  **What to do**:
  - `src/mission/mission.controller.ts` 생성
  - REST 엔드포인트 구현
  - Swagger 태그 및 문서화
  - JWT 인증 Guard 적용

  **Must NOT do**:
  - 복잡한 권한 체크 (LEADER만 수정 가능 등은 추후)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 6
  - **Blocked By**: Task 4

  **References**:
  - `packages/missionary-server/src/user/user.controller.ts` - Controller 패턴 참고
  - `packages/missionary-server/src/auth/guards/jwt-auth.guard.ts` - Guard 적용법

  **Controller Structure**:

  ```typescript
  @ApiTags('Missions')
  @Controller('missions')
  @UseGuards(JwtAuthGuard)
  export class MissionController {
    constructor(private readonly missionService: MissionService) {}

    @Post()
    @ApiOperation({ summary: '선교 생성' })
    create(@CurrentUser() user: User, @Body() dto: CreateMissionDto) {
      return this.missionService.create(user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: '선교 목록 조회' })
    findAll() {
      return this.missionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '선교 단건 조회' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.missionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: '선교 수정' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateMissionDto,
    ) {
      return this.missionService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '선교 삭제' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.missionService.remove(id);
    }
  }
  ```

  **Acceptance Criteria**:
  - [x] mission.controller.ts 파일 생성됨
  - [x] 5개 엔드포인트 구현 (POST, GET, GET/:id, PATCH/:id, DELETE/:id)
  - [x] JwtAuthGuard 적용됨
  - [x] Swagger 문서화됨

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Controller compiles
    Tool: Bash
    Steps:
      1. cd packages/missionary-server
      2. npx tsc --noEmit
    Expected Result: 에러 없음
    Evidence: stdout 캡처
  ```

  **Commit**: YES
  - Message: `feat(server): add MissionController with REST endpoints`
  - Files: `src/mission/mission.controller.ts`

---

- [x] 6. Mission Module 생성 및 AppModule 등록

  **What to do**:
  - `src/mission/mission.module.ts` 생성
  - `src/app.module.ts`에 MissionModule import 추가

  **Must NOT do**:
  - 다른 모듈 수정

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 7
  - **Blocked By**: Task 5

  **References**:
  - `packages/missionary-server/src/user/user.module.ts` - Module 패턴
  - `packages/missionary-server/src/app.module.ts` - 등록 위치

  **Module Structure**:

  ```typescript
  // mission.module.ts
  @Module({
    controllers: [MissionController],
    providers: [MissionService],
    exports: [MissionService],
  })
  export class MissionModule {}

  // app.module.ts에 추가
  imports: [
    // ...existing imports
    MissionModule,
  ];
  ```

  **Acceptance Criteria**:
  - [x] mission.module.ts 파일 생성됨
  - [x] app.module.ts에 MissionModule import됨
  - [x] 빌드 성공

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Server builds successfully
    Tool: Bash
    Steps:
      1. cd /Users/JuChan/Documents/FE/missionary-client
      2. pnpm build:server
    Expected Result: 빌드 성공, 에러 없음
    Evidence: "Successfully compiled" 메시지
  ```

  **Commit**: YES
  - Message: `feat(server): add MissionModule and register in AppModule`
  - Files: `src/mission/mission.module.ts`, `src/app.module.ts`

---

- [x] 7. API 통합 테스트 (수동)

  **What to do**:
  - 서버 실행하여 API 동작 확인
  - curl로 CRUD 테스트

  **Must NOT do**:
  - 자동화된 테스트 작성 (MVP 범위 외)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: None
  - **Blocked By**: Task 6

  **References**:
  - Swagger UI: `http://localhost:3100/api`

  **Acceptance Criteria**:
  - [x] 서버 시작 성공 (port 3100)
  - [x] POST /missions 로 선교 생성 성공
  - [x] GET /missions 로 목록 조회 성공
  - [x] 생성된 선교에 LEADER 멤버 자동 등록 확인

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Create mission via API
    Tool: Bash (curl)
    Preconditions: Server running on localhost:3100, valid JWT token
    Steps:
      1. curl -X POST http://localhost:3100/missions \
           -H "Content-Type: application/json" \
           -H "Authorization: Bearer $TOKEN" \
           -d '{"name":"2024 제주선교","type":"DOMESTIC","startDate":"2024-07-01","endDate":"2024-07-07","pastorName":"김목사"}'
      2. Assert: HTTP status is 201
      3. Assert: response.id exists
      4. Assert: response.members[0].role equals "LEADER"
    Expected Result: 선교 생성됨, LEADER 멤버 포함
    Evidence: Response body 캡처

  Scenario: Get missions list
    Tool: Bash (curl)
    Steps:
      1. curl -X GET http://localhost:3100/missions \
           -H "Authorization: Bearer $TOKEN"
      2. Assert: HTTP status is 200
      3. Assert: response is array
    Expected Result: 선교 목록 반환
    Evidence: Response body 캡처
  ```

  **Commit**: NO (테스트만)

---

## Commit Strategy

| After Task | Message                                                     | Files                                   |
| ---------- | ----------------------------------------------------------- | --------------------------------------- |
| 1          | `feat(server): add Mission and MissionMember schema`        | `prisma/schema.prisma`                  |
| 2          | `chore(server): add mission migration`                      | `prisma/migrations/*`                   |
| 3          | `feat(server): add Mission DTOs`                            | `src/mission/dto/*.ts`                  |
| 4          | `feat(server): add MissionService with CRUD`                | `src/mission/mission.service.ts`        |
| 5          | `feat(server): add MissionController with REST endpoints`   | `src/mission/mission.controller.ts`     |
| 6          | `feat(server): add MissionModule and register in AppModule` | `src/mission/*.ts`, `src/app.module.ts` |

---

## Success Criteria

### Verification Commands

```bash
# 1. 타입 체크
pnpm type-check

# 2. 서버 빌드
pnpm build:server

# 3. 서버 실행
pnpm dev:server

# 4. API 테스트 (서버 실행 후)
curl http://localhost:3100/missions
```

### Final Checklist

- [x] Prisma schema에 Mission, MissionMember 모델 존재
- [x] Migration 적용됨
- [x] MissionModule이 AppModule에 등록됨
- [x] API 5개 엔드포인트 동작
- [x] 선교 생성 시 LEADER 자동 등록

---

## File Structure (Expected)

```
packages/missionary-server/
├── prisma/
│   ├── schema.prisma          # Mission, MissionMember 추가
│   └── migrations/
│       └── XXXXXX_add_mission_model/
├── src/
│   ├── app.module.ts          # MissionModule import 추가
│   └── mission/
│       ├── mission.module.ts
│       ├── mission.controller.ts
│       ├── mission.service.ts
│       └── dto/
│           ├── create-mission.dto.ts
│           └── update-mission.dto.ts
```
