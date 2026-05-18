# Crusoe Tech — Frontend

Next.js 14 App Router frontend with TypeScript and Tailwind CSS.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios, React Hook Form, Zod, Framer Motion, Lucide React

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:5000/api`) |

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
