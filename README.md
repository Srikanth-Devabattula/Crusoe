# Crusoe Tech — Full Stack Project

Professional full-stack boilerplate with separate frontend and backend applications.

## Structure

```
crusoetech/
├── frontend/   # Next.js 14 + TypeScript + Tailwind
└── backend/    # Node.js + Express + MongoDB
```

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Start MongoDB locally, then:
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API (production): [https://crusoe-nhbu.onrender.com/api](https://crusoe-nhbu.onrender.com/api)
- Backend API (local): [http://localhost:5000/api](http://localhost:5000/api)

## Features

- Scalable folder architecture
- Responsive placeholder pages
- REST API structure with JWT auth boilerplate
- MongoDB models and middleware
- File upload support (resumes)
- Email configuration placeholder

## Next Steps

- Implement form logic with React Hook Form + Zod
- Wire admin authentication end-to-end
- Build final UI design
- Seed admin user in database
