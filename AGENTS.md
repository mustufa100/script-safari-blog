# Project rules
- Build auth email redirect URLs only through `src/lib/authRedirect.ts`, so production uses the canonical domain and other environments use their own origin.
- Resolve email callbacks through one shared promise captured before SDK URL consumption to avoid duplicate single-use token exchanges.
- Use the shared admin image field and media uploader for existing image URL fields; retain URLs and rely on Storage RLS for staff authorization.
