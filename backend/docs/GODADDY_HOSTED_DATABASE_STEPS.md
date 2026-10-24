# Airo Hosted Database — step-by-step (Crusoe backend)

App: **NODEJS-11bh9ccomq** · **https://backend.crusoetec.com**

Do **not** use cPanel MySQL host (`sg2plzcpnl509362...`) for Node production.

---

## Step 1 — Get connection details (you, in GoDaddy)

1. Open **Node.js app** → **Settings** → **Hosted Database** → **Open database guide**.
2. Copy: **host**, **port** (3306), **database name**, **username**, **password**.

Do not paste the password in chat or commit it to git.

---

## Step 2 — Build `DATABASE_URL` (you, local only)

Format:

```text
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

URL-encode special characters in the password (e.g. `@` → `%40`).

Update **`backend/.env`** (local, gitignored):

```env
DATABASE_URL="mysql://..."
```

Keep using cPanel URL only if you still need **local dev** on cPanel; for hosted setup use a **second line** comment or swap when running migrate (see Step 4).

---

## Step 3 — GoDaddy Secrets (you or sync script)

**Publish** (and Preview if needed):

- Set **`DATABASE_URL`** to the **Hosted** URL (same as Step 2).
- **Remove** any old secret pointing at **cPanel**.

From PC (after Step 2):

```powershell
cd D:\crusoetech\backend
.\scripts\sync-godaddy-preview-secrets.ps1 -Variant PUBLISH
```

---

## Step 4 — Create tables on Hosted DB (safest: migrate deploy once)

On your PC, with **Hosted** `DATABASE_URL` in `backend/.env`:

```powershell
cd D:\crusoetech\backend
npx prisma migrate deploy
```

- Use **Hosted** URL only — **not** cPanel.
- If deploy says migration already applied but tables are missing, stop and use **Import SQL** (Step 4b) or ask support — do not run deploy + full import blindly on the same DB.

### Step 4b — Alternative: Import SQL in dashboard

**Important:** GoDaddy **drops every existing table** before running your `.sql` file. You must upload a **full** schema file, not a “missing tables only” patch.

1. Hosted Database → **Import database**
2. Upload: **`backend/prisma/godaddy-hosted-import.sql`**  
   (Regenerate after schema changes: `node scripts/generate-godaddy-import-sql.js` — file has **no comments**, Unix line endings, one statement per block.)
3. Do **not** use `hosted-db-missing-tables.sql` or raw `migration.sql` here — partial files leave an empty DB; older generated imports could show `SQL_PARSE_ERROR` (broken line breaks) or `SQL_EXECUTION_FAILED` (TEXT `DEFAULT ''`).
4. **Tables (0)** after a failed import is normal (GoDaddy drops tables first). After success, **Browse tables** should show ~15 tables including `partners`, `news_categories`, `users`.
5. **Restart** the backend app. Default admin/content may need to be re-seeded (empty DB).

---

## Step 5 — Deploy backend (no `.env` in zip)

```powershell
cd D:\crusoetech\backend
.\scripts\package-godaddy-zip.ps1
```

Upload zip → Publish → Restart app (GoDaddy UI or `gddy`).

---

## Step 6 — Verify

- `https://backend.crusoetec.com/api/health` → `database.connected: true`
- `https://backend.crusoetec.com/api/blog-categories` → success
- `https://backend.crusoetec.com/api/partners/public` → success (not 500)
- Logs: no `The table ... does not exist`

---

## Optional — Copy data from cPanel

Export **cPanel** `crusoetech` (phpMyAdmin) → Import into **Hosted Database** (data only, after schema exists).
