# Kifiya banking client

Responsive web client for the Kifiya banking API. It covers sign-in, registration, account overview, new accounts, transfers, bill payment, and transaction history in light and dark themes.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app runs at `http://localhost:5173`. `VITE_API_URL` defaults to `https://challenge-api.qena.dev`.

Demo users on the hosted API:

- `demo.jane` / `Password123!`
- `demo.john` / `Password123!`

## Scripts

- `pnpm dev` starts Vite
- `pnpm test` runs unit and component tests
- `pnpm typecheck` runs the TypeScript checker
- `pnpm lint` runs ESLint
- `pnpm build` creates a production build

## Architecture

Features live under `src/features` (`auth`, `dashboard`, `accounts`, `transfer`, `bills`, `activity`, `profile`). Each feature has `components`, `api`, `hooks`, `other`, and a `routes.tsx`. Pages are loaded with `React.lazy`. `src/core/routes.tsx` composes those routes and attaches a route error screen.

`src/core/layouts` switches at 768px: a split brand panel for auth on desktop, a sidebar for the signed-in app, and a bottom navigation bar on phones.

Server state uses TanStack Query. Forms use React Hook Form and Zod. UI is shadcn/ui styled with the tokens in `src/index.css`.

## Authentication

Access and refresh tokens are stored in `localStorage`. The axios client in `src/core/api/axios-client.ts` sends `Authorization: Bearer <accessToken>`. On a 401 from a protected call it posts to `/api/auth/refresh-token` once, even if several requests fail together, stores the rotated tokens, and retries the original requests. If refresh fails, the session is cleared and the user is sent to `/login?expired=1`.

Login and register send the password in the API field named `passwordHash`. The value is the password the user typed. The API hashes it.

API error `code` values are mapped to short messages in `src/core/api/errors.ts`. Raw backend text is not shown.

## Token storage trade-off

`localStorage` keeps the session across reloads for this demo, and any script on the page can read it. A production bank would keep tokens in httpOnly cookies behind a backend-for-frontend so browser JavaScript cannot access them.
