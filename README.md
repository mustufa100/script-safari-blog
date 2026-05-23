# Script Safari

Premium blog for technology, business, lifestyle, and AI — **Explore Ideas. Discover Stories.**

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL, Auth, REST API)

## Local development

```sh
npm install
npm run dev
```

- **Public site:** http://localhost:8080/
- **Admin panel:** http://localhost:8080/admin (staff login required)
- **Sign in:** http://localhost:8080/auth

Copy `.env` with your Supabase keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## Project structure

- `src/pages/` — Public pages (`Index`, `PostDetail`, `Auth`) and admin managers
- `src/components/` — UI and homepage sections
- `src/integrations/supabase/` — Database client and types
- `supabase/migrations/` — Database schema

## Deploy

Build with `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.). Set environment variables for Supabase on the host.

For social sharing images, use your live domain in `og:image` and `twitter:image` (e.g. `https://yourdomain.com/og-image.svg`).

## License

© Script Safari. All rights reserved.
