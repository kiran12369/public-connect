# Public Connect

A civic services application for citizens to discover government schemes, submit applications/complaints, and track their status. Bilingual support (English + Telugu).

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Capacitor (Android)
- **Backend:** Express 5, MongoDB, Firebase Auth
- **Auth:** Firebase (phone OTP, Google Sign-In) + dev bypass tokens (development only)

## Project Structure

```
public-connect/
├── client/          # Next.js + Capacitor web/mobile app
├── server/          # Express REST API
├── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Firebase project (for auth)

## Setup

### 1. Server

```bash
cd server
cp .env.example .env
# Edit .env with your values (MONGODB_URI, ADMIN_PHONE_NUMBERS, ADMIN_EMAILS, etc.)
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

### 2. Client

```bash
cd client
cp .env.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL and Firebase config
npm install
npm run dev
```

Client runs at `http://localhost:3000`.

### 3. Environment Variables

**Server (.env):**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | API port (default: 5000) |
| `CORS_ORIGIN` | Comma-separated allowed origins (production) |
| `ADMIN_PHONE_NUMBERS` | Comma-separated admin phone numbers |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `FIREBASE_SERVICE_ACCOUNT` | JSON string of Firebase service account |

**Client (.env.local):**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base URL (e.g. `http://localhost:5000/api`) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config |

## Development

- **Dev tokens:** In development, use `Authorization: Bearer dev-token` (user) or `Bearer admin-token` (admin). These are **disabled in production**.
- **Admin:** Set `ADMIN_PHONE_NUMBERS` and/or `ADMIN_EMAILS` in server `.env` to grant admin access.
- **Android:** Update `capacitor.config.ts` to point at your backend URL (e.g. `10.0.2.2:5000` for emulator).

## API Overview

- `POST /api/auth/login` – Login/register (requires Firebase token)
- `GET /api/auth/profile` – Get user profile
- `GET /api/services` – List services/schemes
- `POST /api/applications` – Submit application (auth required)
- `GET /api/applications/my-applications` – List user applications
- `GET /api/applications/track/:id` – Public tracking (status, type, dates only)
- `GET /api/admin/applications` – Admin: list all applications
- `PATCH /api/admin/applications/:id` – Admin: update application status

## Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a deployment checklist.

Key production settings:
- Server: `NODE_ENV=production` and `CORS_ORIGIN` required
- Client: `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_FIREBASE_*` required
- Rate limiting: 100 req/15 min per IP
- Health check: `GET /health`

## Security Notes

- Dev tokens work only when `NODE_ENV=development`
- Test mode buttons are hidden in production
- CORS must be configured via `CORS_ORIGIN` in production
- File uploads: max 5MB, allowed types JPEG/PNG/WebP/PDF
- Public tracking returns minimal fields (no PII)
