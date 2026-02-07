# Architectural Decisions - api-migration

## Decision Log

### [2026-02-07] ID Strategy: UUID Everywhere

**Context**: Spring uses Int IDs, but NestJS best practice is UUID for distributed systems.  
**Decision**: All new models use UUID (`@default(uuid())`). DB reset acceptable (test data only).  
**Rationale**: Prevents ID collision, better for microservices, aligns with existing User model.  
**Alternatives Rejected**: Hybrid (Int + UUID mix) — creates inconsistency.

---

### [2026-02-07] Member Model: Single User Table

**Context**: Spring has 3-table polymorphism (Member ← User/Admin).  
**Decision**: Single `User` table with `role` enum (USER, ADMIN, STAFF).  
**Rationale**: Simpler queries, NestJS-idiomatic, RBAC guards handle authorization.  
**Alternatives Rejected**: 3-table polymorphism — Prisma doesn't support table inheritance well.

---

### [2026-02-07] API Structure: Resource-Based URLs + RBAC

**Context**: Spring uses role-prefixed URLs (`/api/admin/missionaries`, `/api/user/missionaries`).  
**Decision**: Resource-based URLs (`/api/missionaries`) + RBAC guards (`@Roles(ADMIN)`).  
**Rationale**: RESTful, NestJS-idiomatic, reduces URL duplication.  
**Alternatives Rejected**: Role-prefixed URLs — violates REST principles, harder to maintain.

---

### [2026-02-07] Soft Delete: prisma-extension-soft-delete Package

**Context**: Prisma middleware for soft delete doesn't handle nested writes.  
**Decision**: Use `prisma-extension-soft-delete` package.  
**Rationale**: Handles nested writes, battle-tested, community-maintained.  
**Alternatives Rejected**: Raw middleware — breaks on nested creates/updates.

---

### [2026-02-07] Message Queue: BullMQ

**Context**: Spring uses RabbitMQ for async participation processing.  
**Decision**: BullMQ (Redis-based) for NestJS.  
**Rationale**: Official NestJS integration, simpler setup, Redis already in stack.  
**Alternatives Rejected**: RabbitMQ — overkill for current use case, adds infrastructure complexity.

---

### [2026-02-07] Test Strategy: TDD with Jest

**Context**: No existing test infrastructure in missionary-server.  
**Decision**: TDD — write tests BEFORE implementation for all new modules.  
**Rationale**: Ensures correctness, prevents regressions, documents expected behavior.  
**Alternatives Rejected**: Test-after — higher bug risk, lower coverage.

---

### [2026-02-07] Embedded Objects: Flatten to Columns

**Context**: Spring uses `@Embeddable` (Period, BankAccount).  
**Decision**: Flatten to individual columns (startDate, endDate, bankName, etc.).  
**Rationale**: Prisma doesn't support embedded types, flattening is explicit and queryable.  
**Alternatives Rejected**: JSON columns — not type-safe, harder to query.

---

### [2026-02-07] Board Attachments: Metadata Only (No Upload Logic)

**Context**: Spring Board has file upload/storage.  
**Decision**: Implement `MissionaryBoardFile` schema + CRUD, but NO actual file upload/storage logic.  
**Rationale**: File upload is separate concern (S3, local storage), can be added later.  
**Alternatives Rejected**: Full file upload — out of scope, requires infrastructure decisions.

---

### [2026-02-07] AES Encryption: Spring-Compatible Implementation

**Context**: Spring uses AES/CBC/PKCS5Padding with key's first 16 bytes as BOTH key AND IV.  
**Decision**: Replicate exact Spring logic in NestJS for data compatibility.  
**Rationale**: Existing encrypted data in Spring DB must be decryptable.  
**Alternatives Rejected**: Standard AES (separate key/IV) — breaks compatibility.

---

### [2026-02-07] PII Masking: Last 6 Characters

**Context**: Spring masks last 6 chars of PII (e.g., phone numbers).  
**Decision**: Replicate exact masking logic (`******` for last 6 chars).  
**Rationale**: Consistent UX with existing Spring app.  
**Alternatives Rejected**: First N chars masking — different from Spring behavior.

---

_Last updated: 2026-02-07 (Wave 1 start)_
