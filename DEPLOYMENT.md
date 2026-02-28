# Production Deployment Checklist

## Server

**Auto-seed:** On startup, if the `services` collection is empty, the server seeds schemes automatically. No need to run `node seed.js` manually; deploy and the DB will be populated on first run.

1. **Environment**
   - `NODE_ENV=production`
   - `MONGODB_URI` – MongoDB Atlas or production MongoDB
   - `CORS_ORIGIN` – Comma-separated allowed origins (e.g. `https://yourapp.com`)
   - `ADMIN_PHONE_NUMBERS`, `ADMIN_EMAILS`
   - `FIREBASE_SERVICE_ACCOUNT` – JSON string of service account key

2. **Start**
   ```bash
   NODE_ENV=production node server.js
   ```

3. **Health**
   - `GET /health` returns `{ status: 'ok', db: 'connected' }`

4. **Process Manager**
   - Use PM2, systemd, or your platform's process manager
   - Ensure graceful shutdown (SIGTERM/SIGINT)

## Client

1. **Environment**
   - `NEXT_PUBLIC_API_URL` – Production API URL (e.g. `https://api.yourapp.com/api`)
   - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

2. **Build**
   ```bash
   npm run build
   npm run start
   ```

## Android (Capacitor)

1. **Build**
   - Set `NEXT_PUBLIC_API_URL` in `.env.local` before building
   - Run `next build` (or `next export` if using static export)
   - `npx cap sync android`

2. **Capacitor Config**
   - For production, leave `CAPACITOR_SERVER_URL` unset (loads from webDir)
   - For dev with live reload: `CAPACITOR_SERVER_URL=http://10.0.2.2:3000` (or your dev server)

## Security

- [ ] HTTPS for API and web app
- [ ] CORS_ORIGIN set to your domain(s)
- [ ] No dev tokens (auto-disabled when NODE_ENV=production)
- [ ] Test mode buttons hidden in production
- [ ] Firebase credentials from env, not files in repo

## Limits

- API rate limit: 100 req/15 min per IP (production)
- File upload: 5MB max, JPEG/PNG/WebP/PDF only
