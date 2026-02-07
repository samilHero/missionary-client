# Draft: missionary-api → missionary-server 마이그레이션

## Requirements (confirmed)

- 전체 도메인 모두 마이그레이션 (Member, Missionary, Participation, Team, Staff, Church, Board, Region, Terms)
- Spring과 동일 수준의 고급 기능 구현 (RabbitMQ→Bull, CSV export, AES 암호화, PII 마스킹, Soft Delete, Audit Trail)
- API 구조: NestJS에 적합한 방식으로 추천받기로 함

## Technical Decisions

- API 구조: 단일 엔드포인트 + RBAC 가드 (NestJS 추천)
  - NestJS의 @UseGuards + @Roles 데코레이터 활용이 자연스러움
  - Spring의 역할별 컨트롤러 분리보다 가드 기반이 NestJS 컨벤션에 맞음
  - /api/missionaries, /api/churches 등 리소스 기반 URL + RolesGuard로 접근 제어

## Research Findings

### missionary-api (Spring Boot) - 참조 프로젝트

- 19개 서비스, 20+ DTO, 12+ 엔티티
- 역할별 API 분리: User/Admin/Staff 별도 컨트롤러
- 고급 기능: RabbitMQ, CSV export, AES 암호화, PII 마스킹
- Soft Delete + Audit Trail 전체 적용
- QueryDSL로 동적 쿼리

### missionary-server (NestJS) - 현재 상태

- 이미 구현: Auth(JWT/OAuth), User CRUD, Mission 기본 CRUD
- Prisma ORM + PostgreSQL
- 3개 모듈: AuthModule, UserModule, MissionModule
- 없는 것: Church, Participation, Team, Staff, Board, Region, Terms

## Technical Decisions (추가)

- DB 스키마: 전면 재설계 (missionary-api 기준으로 Prisma 스키마 새로 작성)
- 테스트 전략: TDD (RED-GREEN-REFACTOR)
- 테스트 프레임워크: Jest (NestJS 기본) 세팅 필요
- 메시지 큐: BullMQ (Redis 기반, @nestjs/bullmq)
- API 구조: 리소스 기반 URL + RBAC 가드 (NestJS 최적화)

## Open Questions

- (모두 해결됨)

## Scope Boundaries

- INCLUDE: 전체 도메인, 전체 고급 기능, NestJS 최적화 API 구조, TDD, 테스트 인프라 세팅
- EXCLUDE: 프론트엔드 변경 (별도 계획), 배포/인프라 설정
