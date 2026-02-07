# Issues & Gotchas - api-migration

## Known Issues

### Prisma Soft Delete Limitation

**Issue**: Raw Prisma middleware for soft delete doesn't cascade to nested writes.  
**Example**: `prisma.user.create({ data: { posts: { create: {...} } } })` — nested post won't get deletedAt field.  
**Solution**: Use `prisma-extension-soft-delete` package (handles nested writes).  
**Status**: Resolved (decision locked).

---

### Spring AES Encryption Quirk

**Issue**: Spring's `AesEncryptConverter` uses key's first 16 bytes as BOTH key AND IV.  
**Impact**: Standard AES libraries expect separate key/IV — must replicate Spring's exact logic.  
**Solution**: Custom encryption util that mimics Spring behavior.  
**Status**: To be implemented in Task 1.

---

### PII Masking Direction

**Issue**: Spring masks LAST 6 characters (not first N).  
**Example**: `010-1234-5678` → `010-1234-******`  
**Impact**: Common masking libraries default to first N chars.  
**Solution**: Custom masking interceptor.  
**Status**: To be implemented in Task 1.

---

### Embedded Objects in Prisma

**Issue**: Prisma doesn't support `@Embeddable` equivalent (Period, BankAccount).  
**Impact**: Must flatten to individual columns (startDate, endDate, bankName, etc.).  
**Workaround**: Explicit column naming, no abstraction.  
**Status**: Accepted (decision locked).

---

### RBAC Guard Execution Order

**Issue**: NestJS guards execute AFTER middleware but BEFORE interceptors.  
**Impact**: Audit middleware can't access user from JWT (guard hasn't run yet).  
**Solution**: Audit middleware reads JWT directly (not from request.user).  
**Status**: To be verified in Task 1.

---

### BullMQ Redis Dependency

**Issue**: BullMQ requires Redis server running.  
**Impact**: Dev environment needs Redis (Docker or local).  
**Solution**: Document in README, add to docker-compose (future).  
**Status**: Out of scope for this plan (infra setup excluded).

---

### Test Database Strategy

**Issue**: No test DB setup in missionary-server.  
**Options**:

1. In-memory SQLite (fast, but schema differences)
2. Separate PostgreSQL test DB (accurate, but slower)
3. Docker PostgreSQL (isolated, but requires Docker)
   **Decision**: TBD in Task 1 (agent will choose based on existing setup).  
   **Status**: Open.

---

### Existing User Model Compatibility

**Issue**: Current `User` model has `provider`/`providerId` (OAuth), but Spring's Member has PII fields (identityNumber, phoneNumber, etc.).  
**Impact**: Schema migration will ADD columns to existing User table.  
**Solution**: Prisma migration will handle column additions.  
**Status**: To be addressed in Task 2 (schema redesign).

---

## Resolved Issues

_(None yet — Wave 1 just started)_

---

_Last updated: 2026-02-07 (Wave 1 start)_
