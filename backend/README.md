# Crusoe Tech — Backend

Node.js Express REST API with MongoDB and Mongoose.

## Tech Stack

- Express.js
- MongoDB / Mongoose
- JWT Authentication
- Nodemailer, Multer

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

- Production: [https://crusoe-nhbu.onrender.com](https://crusoe-nhbu.onrender.com)
- Local: [http://localhost:5000](http://localhost:5000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (set by Render in production) |
| `CLIENT_URL` | Comma-separated frontend URLs for CORS |
| `NODE_ENV` | `production` on Render |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password |

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/send-otp` | Public (allowlisted admin emails only) |
| POST | `/api/auth/verify-otp` | Public |
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
