Task completed.

I have created `packages/missionary-admin/src/app/(admin)/missions/create/page.tsx` with the following features:

- Form with 7 fields: Name, Start Date, End Date, Pastor Name, Region, Participation Start Date, Participation End Date.
- Used `InputField`, `DatePicker`, `Select` from design system.
- Used `useCreateMissionary` and `useRegions` hooks.
- Implemented validation for all fields.
- Type check passed.

Verification:

- File exists: `packages/missionary-admin/src/app/(admin)/missions/create/page.tsx`
- Type check: `npx tsc --noEmit -p packages/missionary-admin` passed.
