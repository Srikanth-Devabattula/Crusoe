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

## Production (GoDaddy Node.js)

1. Create MySQL database in hosting panel.
2. Set `DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE`
3. Remove `MONGODB_URI` after cutover.
4. Run `npx prisma migrate deploy` on deploy (or locally against prod DB once).
5. Run data migration script if importing existing MongoDB data.
6. Upload `backend` + run `npm install --production`, `npx prisma generate`, `npm start`.
7. Set `CLIENT_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, email vars as today.

---

## Files touched

See repository git diff after migration: `prisma/`, `src/lib/prisma.js`, `src/db/adapters/*`, `src/models/*` (adapters), `gridfsStorage.js`, `config/db.js`, `app.js`, `server.js`, `config/env.js`, `scripts/migrate-mongo-to-mysql.js`.
