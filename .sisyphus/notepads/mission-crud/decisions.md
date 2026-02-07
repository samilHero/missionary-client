## Soft-Delete Implementation for Missionary Service

**Date:** 2026-02-07

### Decision
Implemented soft-delete pattern for the Missionary domain by updating the `missionary.service.ts` file.

### Methods Modified
1. **remove()** - Changed from hard delete to soft delete
   - FROM: `this.prisma.missionary.delete({ where: { id } })`
   - TO: `this.prisma.missionary.update({ where: { id }, data: { deletedAt: new Date() } })`
   - Sets the `deletedAt` timestamp instead of removing the record

2. **findAll()** - Added soft-delete filtering
   - Added `where: { deletedAt: null }` to exclude soft-deleted records
   - Ensures only active missionaries are returned in list queries

3. **findOne()** - Added soft-delete validation
   - Added check: `if (missionary.deletedAt !== null)` after fetching
   - Throws NotFoundException with message: "Missionary with ID {id} has been deleted"
   - Prevents access to soft-deleted records

### Rationale
- Preserves data integrity by maintaining historical records
- Allows recovery of accidentally deleted missionaries
- Consistent with audit trail requirements
- Prisma schema already had `deletedAt DateTime?` field available

### Verification
- ✅ `pnpm build:server` → exit code 0
- ✅ grep "deletedAt: new Date()" found in remove method (line 116)
- ✅ grep "deletedAt: null" found in findAll method (line 43)
- ✅ findOne method includes soft-delete check (lines 65-67)

### Notes
- Other domains (church, poster) still use hard delete (not modified per requirements)
- No database migrations needed (field already exists in schema)
- No changes to controller or DTO files
