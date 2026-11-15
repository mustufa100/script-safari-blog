# Project rules
- Build auth email redirect URLs only through `src/lib/authRedirect.ts`, so production uses the canonical domain and other environments use their own origin.
