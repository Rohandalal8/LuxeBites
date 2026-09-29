# Cravio

Cravio is a premium food discovery and delivery platform built as a real full-stack monorepo using Next.js on the frontend and Express + Prisma + PostgreSQL on the backend.

This repository is intentionally scoped to the Phase 1 foundation so the project starts with a working, production-ready base:

- Next.js + TypeScript + Tailwind
- Express + TypeScript API
- Prisma ORM + PostgreSQL connectivity
- Environment configuration
- Health-check API
- Shared monorepo scripts

## Architecture

```mermaid
flowchart LR
    A[Customer Browser] --> B[Next.js Frontend]
    B --> C[Express API]
    C --> D[Prisma ORM]
    D --> E[PostgreSQL]
    C --> F[Firebase Auth Integration]
```

## Project structure

```text
cravio/
├─ frontend/
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  ├─ package.json
│  └─ .env.example
├─ backend/
│  ├─ prisma/
│  ├─ src/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ .env.example
├─ package.json
├─ README.md
└─ .gitignore
```

## Environment variables

### Frontend

Create a `.env.local` file in the frontend directory based on `.env.example`.

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Backend

Create a `.env` file in the backend directory based on `.env.example`.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cravio?schema=public"
PORT=5000
CLIENT_URL="http://localhost:3000"
NODE_ENV="development"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

## Start the app

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will run at: http://localhost:3000

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

The API will run at: http://localhost:5000

## Backend health check

```bash
curl http://localhost:5000/api/health
```

## PostgreSQL setup

1. Install PostgreSQL locally or use a hosted provider such as Neon / Supabase.
2. Create a database named `cravio`.
3. Set `DATABASE_URL` in the backend `.env` file.
4. Run Prisma generation and migrations when ready:

```bash
cd backend
npx prisma migrate dev --name init
```

## Next milestones

The project is currently staged for Phase 1 completion. The next recommended step is Phase 2: Firebase authentication, user sync, protected routes, and the role system.
