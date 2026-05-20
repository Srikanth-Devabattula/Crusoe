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
| POST | `/api/auth/create-account` | Public (Postman — see below) |
| POST | `/api/auth/login` | Public (website login) |
| GET | `/api/auth/me` | Private |

### Create admin via Postman

**First admin** (no admins in database yet):

```json
POST /api/auth/create-account
{
  "name": "Sri",
  "new_user_email": "admin@example.com",
  "password": "yourpassword"
}
```

**Additional admins** (requires an existing admin email):

```json
POST /api/auth/create-account
{
  "admin_email": "admin@example.com",
  "name": "New Admin",
  "new_user_email": "newadmin@example.com",
  "password": "yourpassword"
}
```
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
