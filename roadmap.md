# Authentication and media uploads
- [x] Audit and fix verification/recovery callbacks and staff session hydration.
- [x] Apply and read back public-read and staff-only write/delete media policies.
- [ ] Create public media bucket — blocked by workspace public_buckets_blocked policy; workspace owner/admin must allow public buckets before creation can be retried.
- [x] Add reusable URL + computer upload field with validation, progress, and previews.
- [x] Integrate post create/edit and web story create/edit thumbnail fields without changing existing content.
- [x] Run 21 targeted tests and authenticated browser checks for native picker, preserved URL on failure, readable upload errors, recovery guards, and mobile layout.
- [ ] Complete upload/save/replace/public-read and unauthorized storage write/delete checks — requires the public media bucket.
- [ ] Complete live registration, email delivery, verification, login, and password reset checks — requires hosted production URL settings and access to a confirmation email.
- [x] Report hosted URL settings and email/deployment checks that require the owner.

# Immediate registration
- [ ] Disable hosted email confirmation without changing unrelated auth security settings.
- [ ] Register with an immediate session and send new users to /login; remove verification-pending copy.
- [ ] Add /login while preserving password recovery and existing staff authorization.
- [ ] Test registration, login, normal-user role assignment, and existing staff access.