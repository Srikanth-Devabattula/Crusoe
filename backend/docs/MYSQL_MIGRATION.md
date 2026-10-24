# MongoDB → MySQL Migration (Prisma)

## Step 1 — Analysis summary

### Mongoose models (13)

| MongoDB model | Collection | Notes |
|---------------|------------|--------|
| User | users | Embedded `permissions` → flat boolean columns; bcrypt on password |
| OTP | otps | TTL-style cleanup; static helpers |
| Blog | blogs | `author` → User FK; `images`/`videoUrls` string arrays → JSON |
| BlogCategory | blogcategories | slug unique |
| News | news | Same shape as Blog |
| NewsCategory | newscategories | slug unique |
| Job | jobs | enum `type` |
| Application | applications | `job` → Job FK; populate in 2 routes |
| Contact | contacts | status enum |
| Testimonial | testimonials | sortOrder |
| TeamMember | teammembers | sortOrder |
| Partner | partners | sortOrder |
| HeroSlide | heroslides | sortOrder, ctaLink |

### GridFS (not a Mongoose model)

Binary files in MongoDB GridFS buckets: `blogCovers`, `newsCovers`, `testimonialPhotos`, `teamPhotos`, `partnerLogos`, `heroSlideImages`, `heroSlideIcons`, `contentImages`.

→ MySQL table **`StoredFile`** (`id`, `bucket`, `filename`, `contentType`, `data` LONGBLOB). API still uses `gridfs:{id}` references.

### Relationships

| From | Field | To |
|------|-------|-----|
| Blog | author | User |
| News | author | User |
| Application | job | Job (optional) |
| Blog/News | category | BlogCategory/NewsCategory by **slug string** (not ObjectId) |

### MongoDB-specific usage

- **populate**: `Application` only (job title/location/experience)
- **aggregate**: OTP stats in `otpCleanupService.js` → Prisma counts
- **transactions/sessions**: none
- **updateMany**: Blog/News `clearOtherFeatured`
- **uniqueSlug**: Blog, News slugs

### Not in scope

- No Stripe/payments in backend
- Frontend unchanged

---

## Step 2 — MySQL mapping

All document `_id` values preserved as **`CHAR(24)`** hex strings for API compatibility.

| MongoDB | MySQL |
|---------|--------|
| ObjectId | `String @id @db.Char(24)` |
| String arrays (URLs/refs) | `Json` |
| Embedded permissions | Boolean columns on `User` |
| GridFS file | `StoredFile.data` + bucket |

---

## Commands

```bash
cd backend
npm install
cp .env.example .env   # set DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Data migration (optional, from existing MongoDB)

```bash
# Set MONGODB_URI and DATABASE_URL in backend/.env
npm run db:audit-counts    # read-only: Mongo vs MySQL counts
npm run db:migrate-data    # idempotent upsert (all collections + GridFS)
```

Does **not** delete MongoDB data or truncate MySQL. Seed rows in MySQL (different `_id`s) may coexist with imported Mongo rows; slug/email conflicts are logged and skipped — remove seed duplicates manually if needed.

---

## Production (GoDaddy Node.js / Airo)

**Important:** GoDaddy Node.js Hosting only allows outbound DB traffic to **GoDaddy managed MySQL** bundled with the app. It **cannot** open TCP `3306` to a **cPanel (Web Hosting) MySQL** host, even if Remote MySQL lists `%` or your IPs. Use cPanel MySQL for local dev (Remote MySQL + your public IP); use **managed MySQL** for the Node backend in production.

1. In the Node app, use the platform **managed MySQL** credentials (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) — or set `DATABASE_URL` yourself from those values. This backend builds `DATABASE_URL` from `DB_*` when `DATABASE_URL` is unset (`src/config/env.js`).
2. Run `npx prisma migrate deploy` once against the managed database (from your PC if the managed host allows your IP, or via a one-off deploy step).
3. Import data from cPanel MySQL if needed (dump/restore or scripts).
4. Set `CLIENT_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, and email vars. Note: external SMTP may not work from the Node container; check GoDaddy’s email gateway rules.
5. **MySQL hostname:** use the host shown on cPanel → **MySQL Databases** for the same account (often `sg2plzcpnl{accountId}.prod.sin2.secureserver.net`, not a different server like `sg2plcpnl0104`).
6. URL-encode special characters in passwords in `DATABASE_URL` (e.g. `@` → `%40`).

---

## Files touched

See repository git diff after migration: `prisma/`, `src/lib/prisma.js`, `src/db/adapters/*`, `src/models/*` (adapters), `gridfsStorage.js`, `config/db.js`, `app.js`, `server.js`, `config/env.js`, `scripts/migrate-mongo-to-mysql.js`.
