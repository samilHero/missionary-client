# Unresolved Problems - api-migration

## Blockers

_(None yet — Wave 1 just started)_

---

## Open Questions

### Test Database Strategy (Task 1)

**Question**: Which test DB approach to use?  
**Options**:

1. In-memory SQLite (fast, schema differences)
2. Separate PostgreSQL test DB (accurate, slower)
3. Docker PostgreSQL (isolated, requires Docker)
   **Impact**: Affects Task 1 test infrastructure setup.  
   **Owner**: Task 1 agent (will decide based on existing setup).  
   **Status**: Open.

---

### Redis Configuration (Task 8)

**Question**: Where should Redis connection config live?  
**Options**:

1. Environment variables (REDIS_HOST, REDIS_PORT)
2. ConfigModule with validation
3. Hardcoded localhost (dev only)
   **Impact**: Affects BullMQ setup in Task 8.  
   **Owner**: Task 8 agent.  
   **Status**: Deferred to Task 8.

---

### File Upload Strategy (Future)

**Question**: How to handle Board file uploads?  
**Options**:

1. Local filesystem (simple, not scalable)
2. S3-compatible storage (scalable, requires setup)
3. Third-party service (Cloudinary, etc.)
   **Impact**: Out of scope for this plan (Board schema only).  
   **Owner**: Future plan.  
   **Status**: Deferred.

---

## Risks

### Risk: Spring Data Compatibility

**Description**: Encrypted data in Spring DB may not decrypt correctly in NestJS.  
**Likelihood**: Medium (AES implementation differences).  
**Impact**: High (data loss/corruption).  
**Mitigation**: Task 1 includes round-trip encryption tests with Spring-generated data.  
**Status**: Monitoring.

---

### Risk: Prisma Migration Conflicts

**Description**: Existing User table schema may conflict with new PII columns.  
**Likelihood**: Low (additive changes only).  
**Impact**: Medium (migration failure).  
**Mitigation**: Task 2 includes migration dry-run verification.  
**Status**: Monitoring.

---

### Risk: BullMQ Performance

**Description**: BullMQ may not handle high participation volume.  
**Likelihood**: Low (current scale is small).  
**Impact**: Medium (slow processing).  
**Mitigation**: Task 8 includes load testing (if time permits).  
**Status**: Accepted.

---

_Last updated: 2026-02-07 (Wave 1 start)_
