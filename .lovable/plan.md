# Complete Script Safari authentication redirects

## What will change
- Set signup confirmation links to `https://scriptsafari.com/auth` in production and the current origin's `/auth` locally or on preview deployments.
- Make `/auth` handle Supabase verification links, exchanged code or token sessions, link errors, and pending confirmation state. After confirmation, show success and return users to sign-in; successful login continues to the existing admin destination.
- Add a small password-reset request and recovery flow so existing reset functionality works with `/reset-password` callbacks.
- Add focused tests for production and non-production redirect selection; preserve existing profile and role behavior.

## Dashboard settings to update manually
In Lovable Cloud → Users → Auth settings → URL Configuration (Advanced), set Site URL to `https://scriptsafari.com` and add `https://scriptsafari.com/**` to Redirect URLs. Keep local and preview callback URLs allowed as needed. These hosted settings are not changed by this implementation.

## Technical details
- Reuse the existing React/Vite, React Router, Supabase client, and auth context.
- Avoid hardcoded Lovable preview URLs. Use a production-host check for the production callback and `window.location.origin` for other environments.
- Do not change database tables, auth roles, or public-facing pages.
