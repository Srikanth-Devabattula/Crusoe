# Crusoe Tech — Backend

Node.js Express REST API with **MySQL** and **Prisma** (MongoDB/Mongoose adapters removed from runtime).

## Tech Stack

- Express.js
- MySQL / Prisma
- JWT Authentication
- Nodemailer, Multer

## Getting Started

```bash
npm install
cp .env.example .env   # set DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, email vars
npx prisma generate
npx prisma migrate deploy   # apply migrations — use deploy, NOT migrate dev, on GoDaddy/shared MySQL
npm run dev
```

**GoDaddy / remote MySQL from local dev:** put the GoDaddy host in `DATABASE_URL`, enable **Remote MySQL** in cPanel for your current public IP, and use your real DB password (URL-encode `@`, `#`, `/`, etc. if needed). Do **not** run `prisma migrate dev` or `prisma migrate reset` against the hosted database.

See [docs/MYSQL_MIGRATION.md](docs/MYSQL_MIGRATION.md) for schema mapping, data import, and deployment.

- Production: [https://crusoe-nhbu.onrender.com](https://crusoe-nhbu.onrender.com)
- Local: [http://localhost:5000](http://localhost:5000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (set by Render in production) |
| `CLIENT_URL` | Comma-separated frontend URLs for CORS |
| `NODE_ENV` | `production` on Render |
| `DATABASE_URL` | MySQL connection string for Prisma |
| `MONGODB_URI` | Optional — only for `npm run db:migrate-data` from legacy MongoDB |
| `JWT_SECRET` | Secret for JWT signing |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password |

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/auth/has-admin` | Public |
| POST | `/api/auth/register` | Public (first admin only) |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| GET | `/api/blogs` | Public |
| POST | `/api/blogs` | Admin |
| PUT | `/api/blogs/:id` | Admin |
| DELETE | `/api/blogs/:id` | Admin |
| GET | `/api/jobs` | Public |
| POST | `/api/jobs` | Admin |
| PUT | `/api/jobs/:id` | Admin |
| DELETE | `/api/jobs/:id` | Admin |
| POST | `/api/contact` | Public |
| POST | `/api/applications` | Public |

## Scripts

- `npm run dev` — Start with nodemon
- `npm start` — Start production server
- `npm run prisma:generate` — Regenerate Prisma Client
- `npm run prisma:deploy` — Apply pending migrations (`migrate deploy`)
- `npm run db:migrate-data` — Optional MongoDB → MySQL import (requires `MONGODB_URI` in `.env`)

`npm run prisma:migrate` runs **`prisma migrate dev`** (local schema iteration only — not for GoDaddy).
