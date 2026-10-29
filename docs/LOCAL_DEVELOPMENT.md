# Local development — full setup guide (with commands)

Complete walkthrough to run **Crusoe Tech** on your machine: install Node.js, MySQL, environment files, migrations, and both apps. Commands below target **Windows PowerShell** unless noted.

**Repo layout**

```text
D:\crusoetech\          ← monorepo root (adjust if yours differs)
├── frontend\           ← Next.js 14 (port 3000)
├── backend\            ← Express + Prisma + MySQL (port 5000)
└── docs\
```

| Service | URL when running locally |
|---------|---------------------------|
| Website | http://localhost:3000 |
| Admin UI | http://localhost:3000/admin/login |
| API base | http://localhost:5000/api |
| Health | http://localhost:5000/api/health |

**Node requirement:** **18+** (`node -v` must show `v18`, `v20`, or `v22`).

---

## Table of contents

1. [Install Node.js and Git](#1-install-nodejs-and-git)
2. [Clone or open the project](#2-clone-or-open-the-project)
3. [Install and configure MySQL](#3-install-and-configure-mysql)
4. [Backend: create `.env`](#4-backend-create-env)
5. [Backend: install, migrate, run](#5-backend-install-migrate-run)
6. [Frontend: create `.env.local`](#6-frontend-create-envlocal)
7. [Frontend: install and run](#7-frontend-install-and-run)
8. [Verify everything works](#8-verify-everything-works)
9. [Admin login and first-time password](#9-admin-login-and-first-time-password)
10. [Day-to-day commands](#10-day-to-day-commands)
11. [Optional: frontend-only (production API)](#11-optional-frontend-only-production-api)
12. [Useful Prisma / database commands](#12-useful-prisma--database-commands)
13. [Environment variable reference](#13-environment-variable-reference)
14. [Troubleshooting](#14-troubleshooting)
15. [Related documentation](#15-related-documentation)

---

## 1. Install Node.js and Git

### 1.1 Node.js (LTS)

1. Download **LTS** from https://nodejs.org/
2. Run the installer → enable **Add to PATH**
3. **Close and reopen** PowerShell

**Verify:**

```powershell
node -v
# Example output: v20.18.0

npm -v
# Example output: 10.8.2
```

If `node` is not recognized, reinstall Node or fix PATH, then open a new terminal.

### 1.2 Node via nvm-windows (optional)

```powershell
# After installing nvm-windows from:
# https://github.com/coreybutler/nvm-windows/releases

nvm install 20
nvm use 20
node -v
```

### 1.3 Git (optional, for clone)

Download: https://git-scm.com/download/win

```powershell
git --version
```

---

## 2. Clone or open the project

### 2.1 Clone from remote

```powershell
cd D:\
git clone <YOUR_REPO_URL> crusoetech
cd D:\crusoetech
```

### 2.2 Already on disk

```powershell
cd D:\crusoetech
dir
# You should see frontend\ and backend\
```

---

## 3. Install and configure MySQL

The backend uses **MySQL 8** (or compatible) with **Prisma**. Choose **one** path.

---

### Path A — Local MySQL (best for daily dev)

#### A1. Install MySQL

Pick one:

- **MySQL Installer:** https://dev.mysql.com/downloads/installer/
- **XAMPP** (includes MySQL): https://www.apachefriends.org/
- **Docker** (see [A4 Docker MySQL](#a4-docker-mysql-optional))

Start the MySQL service (Windows Services or XAMPP Control Panel).

#### A2. Create database and user (MySQL shell)

Open **MySQL Command Line Client** or:

```powershell
mysql -u root -p
```

Run SQL (change password as you like):

```sql
CREATE DATABASE crusoetech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'crusoetech'@'localhost' IDENTIFIED BY 'YourLocalPassword123';
GRANT ALL PRIVILEGES ON crusoetech.* TO 'crusoetech'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

#### A3. Connection string for `.env`

```env
DATABASE_URL="mysql://crusoetech:YourLocalPassword123@localhost:3306/crusoetech"
```

If the password contains `@`, `#`, `/`, or `%`, URL-encode them in the URL (e.g. `@` → `%40`).

#### A4. Docker MySQL (optional)

```powershell
docker run --name crusoetech-mysql `
  -e MYSQL_ROOT_PASSWORD=rootpass `
  -e MYSQL_DATABASE=crusoetech `
  -e MYSQL_USER=crusoetech `
  -e MYSQL_PASSWORD=YourLocalPassword123 `
  -p 3306:3306 `
  -d mysql:8
```

Wait ~30 seconds, then use:

```env
DATABASE_URL="mysql://crusoetech:YourLocalPassword123@localhost:3306/crusoetech"
```

**Test connection:**

```powershell
docker exec -it crusoetech-mysql mysql -ucrusoetech -pYourLocalPassword123 -e "SHOW DATABASES;"
```

---

### Path B — Remote GoDaddy / hosted MySQL (production data)

Use when you need the **same data** as production.

1. **cPanel → Remote MySQL** → add your **current public IP** (find IP: https://ifconfig.me or `curl ifconfig.me`)
2. Copy **host**, **database name**, **username**, **password** from cPanel or `backend/docs/GODADDY_HOSTED_DATABASE_STEPS.md`
3. Build `DATABASE_URL`:

```env
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME"
```

**Important commands on remote DB:**

```powershell
cd D:\crusoetech\backend
npx prisma migrate deploy
```

**Never** on production/hosted DB:

```powershell
# DO NOT RUN on GoDaddy / production:
npx prisma migrate dev
npx prisma migrate reset
```

---

## 4. Backend: create `.env`

### 4.1 Copy example file

```powershell
cd D:\crusoetech\backend
copy .env.example .env
notepad .env
```

(Or open `.env` in VS Code / Cursor.)

### 4.2 Minimal local `.env` template

Paste and **replace** placeholders:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:3000

DATABASE_URL="mysql://crusoetech:YourLocalPassword123@localhost:3306/crusoetech"

JWT_SECRET=change-this-to-a-random-string-at-least-32-characters-long

ADMIN_EMAIL=info@crusoetec.com
ADMIN_NAME=Administrator

# --- Email (needed for admin Forgot password OTP) ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_TLS_REJECT_UNAUTHORIZED=true
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_google_app_password
SMTP_FROM=your@gmail.com
NOTIFY_EMAIL=your@gmail.com
```

**Required for server start:** `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL` (validated in `backend/src/config/env.js`).

**Generate a JWT secret (PowerShell):**

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })
```

Copy the output into `JWT_SECRET=`.

### 4.3 Gmail app password (for OTP)

1. Google Account → Security → 2-Step Verification (must be on)
2. App passwords → create → Mail → copy 16-character password
3. Put it in `SMTP_PASS` (no spaces)

---

## 5. Backend: install, migrate, run

Run these **in order** from `D:\crusoetech\backend`.

### 5.1 Install dependencies

```powershell
cd D:\crusoetech\backend
npm install
```

This also runs `postinstall` → `prisma generate`.

### 5.2 Regenerate Prisma client (if needed)

```powershell
npx prisma generate
```

### 5.3 Apply database schema

**Local database (first time):**

```powershell
npx prisma migrate dev
```

When prompted for a migration name, you can press Enter or type `init`.

**Remote / GoDaddy database (updates only):**

```powershell
npx prisma migrate deploy
```

### 5.4 Start backend in development mode

```powershell
npm run dev
```

Expected console: server listening on port **5000**, no “Missing required environment variables” error.

**Leave this terminal open.**

### 5.5 Production-style start (optional test)

```powershell
# In a separate terminal, after npm install:
npm start
```

---

## 6. Frontend: create `.env.local`

### 6.1 Copy example

```powershell
cd D:\crusoetech\frontend
copy .env.example .env.local
notepad .env.local
```

### 6.2 Local full-stack settings

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Why |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | All API calls and **upload/image URLs** use this host |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, SEO helpers |

**After changing `.env.local`, restart `npm run dev`.**

### 6.3 Optional

```env
GOOGLE_SITE_VERIFICATION=your_search_console_token
```

Usually omitted locally; production uses Search Console verification in site metadata.

---

## 7. Frontend: install and run

**New terminal** (keep backend running):

```powershell
cd D:\crusoetech\frontend
npm install
npm run dev
```

Expected:

```text
▲ Next.js 14.x
- Local: http://localhost:3000
✓ Ready
```

Open http://localhost:3000 in the browser.

**Different port if 3000 is busy:**

```powershell
npm run dev -- -p 3001
```

Then set `CLIENT_URL=http://localhost:3001` in backend `.env` and `NEXT_PUBLIC_SITE_URL=http://localhost:3001` in `.env.local`.

---

## 8. Verify everything works

### 8.1 Health check (PowerShell)

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" | ConvertTo-Json -Depth 5
```

Look for:

```json
"database": { "connected": true, "provider": "mysql" }
```

**curl alternative:**

```powershell
curl.exe http://localhost:5000/api/health
```

### 8.2 API root

```powershell
curl.exe http://localhost:5000/api
```

### 8.3 Admin configured

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/has-admin"
```

When `ADMIN_EMAIL` is set in `.env`, expect `hasAdmin: true`.

### 8.4 Frontend loads data

With both servers running, visit:

- http://localhost:3000/blog  
- http://localhost:3000/contact  

If lists are empty, the DB is new — that is normal until you add content in admin.

### 8.5 Checklist

- [ ] `node -v` ≥ 18  
- [ ] `backend/.env` exists with `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`  
- [ ] `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000/api`  
- [ ] `npm run dev` running in **backend** (port 5000)  
- [ ] `npm run dev` running in **frontend** (port 3000)  
- [ ] `/api/health` shows `connected: true`  

---

## 9. Admin login and first-time password

Admin email **must match** `ADMIN_EMAIL` in `backend/.env`.

### 9.1 Set password via UI (recommended)

1. Open http://localhost:3000/admin/login  
2. Click **Forgot password**  
3. Enter the same email as `ADMIN_EMAIL`  
4. Check inbox for OTP (requires SMTP configured)  
5. Set password and log in  

### 9.2 First admin via API (empty database, no admin user yet)

Only works when **no** user with `role: admin` exists:

```powershell
$body = @{
  name = "Administrator"
  email = "info@crusoetec.com"
  password = "YourSecurePassword123"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
  -Uri "http://localhost:5000/api/auth/register" `
  -ContentType "application/json" `
  -Body $body
```

Use the **same email** as `ADMIN_EMAIL`.

### 9.3 Admin login API (after password exists)

```powershell
$body = @{
  email = "info@crusoetec.com"
  password = "YourSecurePassword123"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
  -Uri "http://localhost:5000/api/auth/admin-login" `
  -ContentType "application/json" `
  -Body $body
```

### 9.4 Staff / user login

Separate flow: http://localhost:3000/admin/user-login → `POST /api/auth/login` (staff users created in admin panel).

---

## 10. Day-to-day commands

### 10.1 Two terminals every session

**Terminal 1 — API**

```powershell
cd D:\crusoetech\backend
npm run dev
```

**Terminal 2 — Website**

```powershell
cd D:\crusoetech\frontend
npm run dev
```

### 10.2 Backend scripts

```powershell
cd D:\crusoetech\backend

npm run dev              # nodemon, auto-restart on file change
npm start                # node src/server.js
npm run build            # prisma generate
npm run prisma:generate  # same as prisma generate
npm run prisma:migrate   # prisma migrate dev — LOCAL DB ONLY
npm run prisma:deploy    # prisma migrate deploy — safe for hosted DB
```

### 10.3 Frontend scripts

```powershell
cd D:\crusoetech\frontend

npm run dev              # development server
npm run build            # production build → .next
npm run start            # serve production build (run build first)
npm run lint             # ESLint
npm run clean            # delete .next folder
npm run rebuild          # clean + build
```

### 10.4 Pull latest code and refresh deps

```powershell
cd D:\crusoetech
git pull

cd backend
npm install
npx prisma generate
npx prisma migrate deploy

cd ..\frontend
npm install
```

Then restart both `npm run dev` processes.

---

## 11. Optional: frontend-only (production API)

UI work **without** local backend:

**`frontend/.env.local`:**

```env
NEXT_PUBLIC_API_URL=https://backend.crusoetec.com/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```powershell
cd D:\crusoetech\frontend
npm run dev
```

Warning: admin edits from localhost will change **production** data.

---

## 12. Useful Prisma / database commands

All from `D:\crusoetech\backend`:

```powershell
# Open visual DB browser
npx prisma studio

# See migration status
npx prisma migrate status

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

**Optional data scripts** (see `backend/package.json`):

```powershell
npm run db:mysql-counts
# npm run db:migrate-data   # needs MONGODB_URI in .env — legacy import only
```

---

## 13. Environment variable reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL URL for Prisma |
| `JWT_SECRET` | Yes | JWT signing secret (32+ chars recommended) |
| `ADMIN_EMAIL` | Yes | Only this email can admin-login / admin OTP |
| `PORT` | No | Default `5000` |
| `NODE_ENV` | No | `development` locally |
| `CLIENT_URL` | No | CORS allowed origin(s), comma-separated |
| `ADMIN_NAME` | No | Display name |
| `SMTP_*` | No* | *Needed for OTP / mail |
| `RESEND_API_KEY` | No | Alternative to SMTP |
| `RESEND_FROM` | No | Sender when using Resend |
| `NOTIFY_EMAIL` | No | Inbox for contact form notifications |
| `MONGODB_URI` | No | Legacy import scripts only |

**Production-only (GoDaddy secrets):** `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` can build `DATABASE_URL` on the server. Locally use `DATABASE_URL` only.

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Must end with `/api` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site URL for SEO |
| `GOOGLE_SITE_VERIFICATION` | No | Search Console token |

Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## 14. Troubleshooting

### Backend will not start

```powershell
cd D:\crusoetech\backend
node src/server.js
```

Read the error:

| Message | Fix |
|---------|-----|
| Missing `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL` | Fill `backend/.env` |
| JWT warning | Use longer `JWT_SECRET` |
| Prisma / connection errors | Fix MySQL URL, start MySQL, check firewall |

### `database.connected: false`

```powershell
# Test MySQL is listening
Test-NetConnection -ComputerName localhost -Port 3306

# Remote DB: confirm IP in cPanel Remote MySQL
curl.exe ifconfig.me
```

### CORS error in browser DevTools

Ensure `backend/.env`:

```env
CLIENT_URL=http://localhost:3000
```

Restart backend after editing `.env`.

### Frontend cannot reach API

1. Backend running? `curl.exe http://localhost:5000/api/health`  
2. `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000/api` (note **`/api`**)  
3. Restart frontend after env changes  

### Blog/news images 404 locally

Images are served from the **API host**. For local dev:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Not the production backend URL unless you intentionally use remote uploads.

### Port already in use

**Find process on 5000:**

```powershell
netstat -ano | findstr :5000
# Note PID, then:
taskkill /PID <PID> /F
```

Or change `PORT=5001` in `.env` and update `NEXT_PUBLIC_API_URL` accordingly.

### OTP email not received

- Verify `SMTP_USER` / `SMTP_PASS` (App Password, not Gmail login password)  
- Check spam folder  
- Restart backend after `.env` changes  
- Inspect backend terminal for mail errors  

### `npm install` fails

```powershell
node -v    # must be 18+
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Run inside `backend` or `frontend` separately.

---

## 15. Related documentation

| File | Contents |
|------|----------|
| [README.md](../README.md) | Monorepo overview |
| [backend/README.md](../backend/README.md) | API routes and scripts |
| [frontend/README.md](../frontend/README.md) | Frontend structure |
| [backend/docs/MYSQL_MIGRATION.md](../backend/docs/MYSQL_MIGRATION.md) | Schema / data migration |
| [backend/docs/GODADDY_HOSTED_DATABASE_STEPS.md](../backend/docs/GODADDY_HOSTED_DATABASE_STEPS.md) | Production DB on Airo |

---

## Security

- **Do not commit** `backend/.env` or `frontend/.env.local` (they are gitignored).  
- Do not paste production passwords in chat or documentation.  
- Prefer **local MySQL** for daily development; use remote DB only when necessary.  
- Rotate `JWT_SECRET` and DB passwords if they were ever exposed.
