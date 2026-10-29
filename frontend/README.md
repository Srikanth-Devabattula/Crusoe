# Crusoe Tech — Frontend

Next.js 14 App Router frontend with TypeScript and Tailwind CSS.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios, React Hook Form, Zod, Framer Motion, Lucide React

## Getting Started

See the monorepo guide: **[../docs/LOCAL_DEVELOPMENT.md](../docs/LOCAL_DEVELOPMENT.md)** (Node install, backend + frontend env, MySQL, two-terminal workflow).

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run the **backend** on port 5000 when using `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (local: `http://localhost:5000/api`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO/canonicals (local: `http://localhost:3000`) |
| `GOOGLE_SITE_VERIFICATION` | Optional — Search Console HTML tag token |

## Project Structure

```
src/
├── app/           # App Router pages
├── components/    # UI, layout, forms, admin
├── hooks/         # Custom React hooks
├── services/      # API service layer
├── lib/           # Axios instance, utilities
├── utils/         # Helper functions
├── types/         # TypeScript types
├── constants/     # App constants
└── middleware.ts  # Route protection placeholder
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
