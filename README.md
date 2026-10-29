# Crusoe Tech — Full Stack Project

Monorepo for **crusoetec.com**: Next.js frontend + Express API with MySQL (Prisma).

## Structure

```
crusoetech/
├── frontend/   # Next.js 14 + TypeScript + Tailwind
├── backend/    # Node.js + Express + MySQL + Prisma
└── docs/       # Shared documentation
```

## Local development

**Start here:** [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md) — **in-depth guide with copy-paste PowerShell commands** (Node install, MySQL, `.env` templates, migrations, verify health, admin OTP, Prisma, troubleshooting).

Quick reference after env is configured:

```powershell
# Terminal 1
cd backend
npm install
npx prisma generate
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000/api  
- Health: http://localhost:5000/api/health  

## Production

- Site: https://crusoetec.com  
- API: https://backend.crusoetec.com/api  

Deploy and hosting details live under `frontend/scripts/` and `backend/docs/` (GoDaddy / Airo).

## App READMEs

- [frontend/README.md](frontend/README.md)  
- [backend/README.md](backend/README.md)  
