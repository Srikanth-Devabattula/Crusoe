# Admin OTP Authentication — Setup Guide

Production-ready admin login using **email OTP**, **JWT**, **MongoDB**, **Gmail SMTP**, **Next.js**, and **Express**.

## Allowed admin emails

Configured in `backend/src/config/adminEmails.js`:

- `srikanthdevabathula@gmail.com`
- `srikanth01107@gmail.com`

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/admin/send-otp` | Send 6-digit OTP (5 min expiry) |
| POST | `/api/admin/verify-otp` | Verify OTP, return JWT + user |
| GET | `/api/admin/me` | Current admin (protected) |
| POST | `/api/admin/logout` | Clear session cookie (protected) |

## Folder structure

```
backend/src/
  config/
    adminEmails.js    # Allowlist
    mail.js           # Nodemailer / Gmail
  controllers/
    adminAuthController.js
  middleware/
    authMiddleware.js
  models/
    Otp.js
    User.js
  routes/
    adminRoutes.js
  utils/
    otp.js
    adminCookie.js
    generateToken.js

frontend/src/
  app/admin/login/page.tsx
  components/admin/AdminLoginForm.tsx
  contexts/AuthContext.tsx
  services/admin-auth.service.ts
  lib/auth-storage.ts
  middleware.ts
```

---

## 1. Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local
npm run dev
```

---

## 2. Environment variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=long_random_secret_min_32_chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 3. Gmail SMTP setup

1. Enable **2-Step Verification** on your Google account.
2. Create an **App Password**: https://myaccount.google.com/apppasswords
3. Use:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER` = your Gmail address
   - `SMTP_PASS` = 16-character app password

Restart the backend after changing `.env`.

---

## 4. Local testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000/admin/login
4. Enter an **allowlisted** email → **Send verification code**
5. Check your inbox (or backend logs if SMTP fails)
6. Enter OTP → redirected to `/admin/dashboard`

---

## 5. Security features

- Allowlisted emails only
- OTP hashed in MongoDB (HMAC)
- OTP expires in **5 minutes**
- Max **5** failed verify attempts per OTP
- JWT in **httpOnly** cookie (`adminToken`) from API
- Bearer token in **sessionStorage** for cross-origin API calls
- Cookie on frontend domain for Next.js route protection
- Rate limiting on OTP routes
- `adminOnly` middleware on protected admin APIs

---

## 6. Deploy — Render (backend)

1. Push code to GitHub.
2. Render → Web Service → connect repo, root: `backend`.
3. Build: `npm install` · Start: `npm start`
4. Environment variables (same as `.env`):
   - `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL + localhost if needed)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `NODE_ENV=production`
5. Deploy and verify: `POST https://your-api.onrender.com/api/admin/send-otp`

---

## 7. Deploy — Vercel (frontend)

1. Import repo, root: `frontend`.
2. Environment:
   - `NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api`
3. Deploy.
4. Update Render `CLIENT_URL` to include your Vercel URL, e.g.  
   `https://your-app.vercel.app,http://localhost:3000`

---

## 8. Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 on `/api/admin/send-otp` | Redeploy backend with latest code |
| OTP email not received | Check Gmail app password and SMTP env on Render |
| CORS error | Add Vercel URL to `CLIENT_URL` on Render |
| "You don't have access" | Use exact allowlisted email |
| Redirect loop on login | Clear cookies / sessionStorage, try again |

---

## 9. Login flow

```
Email → POST /api/admin/send-otp → Email with 6-digit OTP
     → POST /api/admin/verify-otp → JWT + cookies
     → GET /api/admin/me → Admin dashboard
```

Logout: sidebar **Logout** → `POST /api/admin/logout` + clear local session.
