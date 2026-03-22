<div align="center">

<img src="https://img.shields.io/badge/-%F0%9F%9A%97%20COVOIT%20FRONTEND-0a0a0a?style=for-the-badge&labelColor=0a0a0a" />

### Carpooling Platform — React 19 + TypeScript + Vite

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-PostCSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Laravel_Echo-Reverb-FF2D20?style=flat-square&logo=laravel&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Nginx-SPA-009639?style=flat-square&logo=nginx&logoColor=white&labelColor=0a0a0a" />
</p>

<p>
  🌐 <strong>English</strong> &nbsp;|&nbsp; <a href="README.en.md">English</a> &nbsp;|&nbsp; <a href="README.ar.md">العربية</a>
</p>

</div>

---

> **Production-oriented SPA** for a carpooling platform. Built with React 19, TypeScript 5, and Vite 7 — covering the full authenticated rider/driver experience: trip discovery, booking management, driver tools, account settings, and real-time in-app chat via Laravel Reverb.

---

## 📚 Table of Contents

- [✨ Overview](#-overview)
- [🧱 Tech Stack](#-tech-stack)
- [🗺 Core Features](#-core-features)
- [🏗 Application Architecture](#-application-architecture)
- [🔀 Routing](#-routing)
- [🧠 State & Context](#-state--context)
- [🔌 API Integration](#-api-integration)
- [💬 Real-Time Chat](#-real-time-chat)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Getting Started](#-getting-started)
- [🛠 Development Workflow](#-development-workflow)
- [📜 Available Scripts](#-available-scripts)
- [📁 Project Structure](#-project-structure)
- [🎨 Styling Approach](#-styling-approach)
- [🌍 Build & Deployment](#-build--deployment)
- [🔧 Troubleshooting](#-troubleshooting)

---

## ✨ Overview

The Covoit frontend is a Vite-powered React + TypeScript SPA centered around the logged-in user journey:

| Journey Step | Description |
|---|---|
| 🔐 **Authenticate** | Login, register, forgot/reset password |
| 👤 **Complete Profile** | Mandatory gate before accessing the app |
| 🔍 **Discover Trips** | Search available rides and view details |
| 🎟 **Book & Manage** | Reserve seats, review and cancel bookings |
| 🚗 **Drive** | Publish trips, manage passengers, cancel rides |
| 🏠 **Account** | Update personal profile and vehicle information |
| 💬 **Chat** | Exchange messages with drivers or passengers in real time |

> The application assumes a compatible Laravel backend is running. Several behaviors depend on backend session cookies, permission flags, chat broadcasting, and API route contracts.

---

## 🧱 Tech Stack

| Technology | Version | Role |
|---|---|---|
| ⚛️ **React** | 19 | UI framework |
| 🔷 **TypeScript** | 5 | Static typing |
| ⚡ **Vite** | 7 | Dev server & bundler |
| 🔀 **React Router DOM** | 7 | Client-side routing |
| 🌐 **Axios** | latest | HTTP client |
| 📡 **Laravel Echo** | latest | WebSocket client wrapper |
| 🔌 **pusher-js** | latest | Browser transport for Reverb |
| 🎨 **Tailwind CSS** | via PostCSS | Utility-first styling |
| ✅ **ESLint** | 9 | Linting |
| 🟩 **Nginx** | latest | Static SPA serving in deployment |

> **Notes:**
> - Tailwind is enabled via `@tailwind` directives in `src/index.css` and PostCSS config
> - No Tailwind config file is present in the repo at this time
> - No test runner is configured in `package.json` yet

---

## 🗺 Core Features

```
🔐  Auth flows ............. login · register · forgot password · reset password
🛡  Route guards ........... guest-only · profile-completion gate · permission-based
🏠  Dashboard .............. upcoming driver trips · upcoming bookings
🔍  Trip discovery ......... search · results · trip detail
🎟  Reservations ........... book seat · cancel booking
🚗  Driver tools ........... publish trip · manage trip · cancel trip · contact passenger
👤  Account ................ profile management · vehicle management
💬  Chat ................... inbox · conversation view · real-time updates
⚠️  Global feedback ........ loading overlay · error alert
```

---

## 🏗 Application Architecture

The app uses a lightweight provider-first React architecture. No Redux, Zustand, or React Query — data fetching is handled with custom hooks and feature-specific Axios calls.

### Runtime composition (`src/App.tsx`)

```
LoadingProvider
  └── AxiosInterceptorProvider
        └── AuthProvider
              └── ChatInboxProvider
                    └── GlobalSpinner + GlobalErrorAlert
                          └── AppRouter
```

### Layer responsibilities

| Layer | Path | Responsibility |
|---|---|---|
| 🏛 **App infra** | `src/app/` | Axios clients, API error helpers, global error provider |
| 🌐 **Providers** | `src/providers/` | Auth, loading, chat inbox state |
| 🔀 **Router** | `src/router/` | Route tree and access guards |
| 📦 **Features** | `src/features/` | Backend-facing API modules and chat realtime utilities |
| 🧠 **Context** | `src/context/` | Page/domain hooks and React contexts |
| 📄 **Pages** | `src/pages/` | Route-level page components |
| 🧩 **Components** | `src/components/` | Layout, shared primitives, UI sections |
| 🔷 **Types** | `src/types/` | TypeScript API/domain models |

---

## 🔀 Routing

Routing is defined in `src/router/AppRouter.tsx` using `BrowserRouter` with nested guard wrappers.

### 🔓 Public / Guest routes
> Wrapped by `GuestRoute` — redirects authenticated users away from auth screens

```
/login
/register
/forgot-password
/reset-password
```

### 👤 Profile completion route
> Enforced when `first_name`, `last_name`, or `pseudo` are missing on the authenticated user

```
/complete-profile
```

### 🔒 Protected routes
> Require authentication

```
/home
/find-trip
/find-trip/results
/trips/:tripId
/trips/:tripId/contact-driver
/chat
/chat/:conversationId
```

### 🚗 Driver routes
> Require `can_manage_own_trips` permission

```
/my-trips
/my-trips/new
/my-trips/:tripId
/my-trips/:tripId/contact-passenger/:passengerId
```

### 🎟 Booking routes
> Require `can_view_bookings` permission

```
/bookings
/bookings/:tripId
```

### ⚙️ Account routes
> Require `can_edit_profile` permission

```
/my-account
```

> The bottom navigation bar is permission-aware and only renders sections available to the current user.

---

## 🧠 State & Context

### Global providers

| Provider | Responsibility |
|---|---|
| `AuthProvider` | Resolves `/auth/me`, retries with `/auth/refresh`, exposes `status`, `user`, `refreshMe`, `logoutLocal` |
| `LoadingProvider` | Tracks active request count, powers global loading overlay |
| `ChatInboxProvider` | Loads conversations, computes unread counts, listens for realtime updates, refreshes on interval |
| `ErrorProvider` | Holds app-wide error state for `GlobalErrorAlert` |

### Page/domain hooks (`src/context/`)

| Hook | Purpose |
|---|---|
| `useHome` | Dashboard data |
| `useTripResults` / `useTripDetails` | Trip discovery flows |
| `useMyTrips` / `usePublishTrip` / `useDriverTripDetails` | Driver workflows |
| `useMyBookings` / `useBookingDetails` | Rider booking workflows |
| `useMyAccount` | Profile + car management |
| `useChatConversation` | Message threads |
| `useLogin` / `useRegister` | Auth forms |

### Storage usage

| Store | Key | Usage |
|---|---|---|
| `sessionStorage` | `personId` | Stored after login — used by person/account API calls |
| `localStorage` | refresh token | Stored by login flow for session continuity |
| `localStorage` | chat read state | Unread metadata scoped per user session |

---

## 🔌 API Integration

### Internal API client (`src/app/apiClient.ts`)

- Base URL from `VITE_API_BASE_URL`
- `Content-Type: application/json`
- `withCredentials: true` for cookie-based auth
- Automatic 401 retry via `/auth/refresh` for non-auth endpoints

### External API client (`src/app/externalApiClient.ts`)

A second Axios client without credentials, used for:

| Service | URL |
|---|---|
| 🗺 Commune search | `https://geo.api.gouv.fr` |
| 📍 Address geocoding | `https://data.geopf.fr/geocodage/search` |

### Feature modules

```
src/features/
  ├── auth/         authApi.ts · passwordApi.ts
  ├── trips/        tripApi.ts
  ├── person/       personApi.ts
  ├── cars/         carApi.ts
  ├── brands/       brandApi.ts
  ├── chat/         chatApi.ts · chatEcho.ts · chatReadState.ts
  ├── contact/      contactApi.ts
  └── geo/          geoApi.ts
```

### Expected backend endpoints

```
POST   /auth/login · /auth/register · /auth/refresh · /auth/logout
GET    /auth/me
POST   /auth/forgot-password · /auth/reset-password

GET    /persons/:id
GET    /persons/:id/trips-driver · /persons/:id/trips-passenger

GET    /trips · /trips/:id · /trips/:id/person
POST   /trips/:id/contact-driver
POST   /my-trips/:id/contact-passenger/:personId

GET    /cars · /cars/:id · /cars/search
GET    /brands

GET    /conversations · /conversations/:id
POST   /conversations/:id/messages

POST   /broadcasting/auth · /broadcasting/auth-proxy
```

---

## 💬 Real-Time Chat

Chat uses a **hybrid realtime + polling** strategy for resilience.

### Stack

| Component | Technology |
|---|---|
| Echo client | `src/features/chat/chatEcho.ts` |
| Transport | `pusher-js` (Reverb-compatible) |
| Auth | Private channel auth via backend |

### Channels

```
chat.user.{personId}          ← inbox-level updates
chat.conversation.{id}        ← conversation-level messages
```

Listens for `.chat.message.sent` events.

### Polling fallback

| Scope | Interval |
|---|---|
| Inbox | every **8 seconds** |
| Active conversation | every **5 seconds** |

### Unread state

- Persisted in `localStorage` per user session scope
- Unread counts shown in bottom navigation
- Marked as read when conversation is opened
- Incoming message alert cards shown transiently

> If broadcasting is unavailable, polling keeps chat functional — but live indicators and connection status may not behave as expected.

---

## ⚙️ Environment Variables

Copy from `.env.example` and adjust to your environment:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ Yes | Backend API base URL |
| `VITE_REVERB_APP_KEY` | ⚡ Realtime | Public Reverb app key for Laravel Echo |
| `VITE_REVERB_HOST` | ⚡ Realtime | WebSocket hostname (browser-facing) |
| `VITE_REVERB_PORT` | Optional | Shared HTTP/WS port fallback |
| `VITE_REVERB_WS_PORT` | Optional | Explicit non-TLS WebSocket port |
| `VITE_REVERB_WSS_PORT` | Optional | Explicit TLS WebSocket port |
| `VITE_REVERB_SCHEME` | Optional | `http` or `https` |

**Example local config:**

```env
VITE_API_BASE_URL=http://covoit.local
VITE_REVERB_APP_KEY=local-key
VITE_REVERB_HOST=covoit.local
VITE_REVERB_PORT=80
VITE_REVERB_WS_PORT=80
VITE_REVERB_WSS_PORT=443
VITE_REVERB_SCHEME=http
```

> Use `.env.local` or `.env` for local setup — both are gitignored.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (repo includes `package-lock.json`)
- A running backend compatible with the expected API and broadcasting contracts

### Install dependencies

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env.local
# Edit .env.local to match your local setup
```

### Start the development server

```bash
npm run dev
```

Vite dev server config (`vite.config.ts`):

| Setting | Value |
|---|---|
| Host | `127.0.0.1` |
| Port | `5173` |
| Allowed host | `covoit.local` |

> If using the `covoit.local` hostname, configure your `/etc/hosts` and local proxy accordingly.

---

## 🛠 Development Workflow

```bash
# 1. Start the backend/API + broadcasting services
# 2. Create/update .env.local
# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev

# 5. Lint before committing
npm run lint

# 6. Verify production readiness
npm run build
```

> ⚠️ No automated test script is configured yet. Linting and production builds are the primary in-repo validation steps.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Run `tsc -b && vite build` — TypeScript check + bundle |
| `npm run lint` | Run `eslint .` |
| `npm run preview` | Serve the production build locally |

---

## 📁 Project Structure

```
covoit-front/
│
├── public/                     # Static public assets
│
├── src/
│   ├── app/                    # Axios clients, error helpers, global error provider
│   ├── assets/                 # Images and static frontend assets
│   ├── auth/                   # Profile completion check helpers
│   │
│   ├── components/
│   │   ├── common/             # Reusable UI primitives and feedback components
│   │   ├── layout/             # App shell and bottom navigation
│   │   └── ui/                 # Feature-oriented presentation sections
│   │
│   ├── context/                # Page/domain hooks and React contexts
│   ├── features/               # API modules and realtime/chat utilities
│   ├── pages/                  # Route-level page components
│   ├── providers/              # Long-lived app-wide providers
│   ├── router/                 # Route config and access guards
│   ├── types/                  # TypeScript API/domain models
│   │
│   ├── App.tsx                 # Root provider composition
│   ├── bootstrap.ts            # Axios loading interceptors setup
│   ├── index.css               # Global theme tokens + Tailwind layers
│   └── main.tsx                # App entry point
│
├── .env.example                # Documented Vite env variables
├── eslint.config.js            # ESLint flat config
├── nginx.conf                  # SPA static serving (try_files fallback)
├── package.json                # Scripts and dependencies
├── postcss.config.js           # Tailwind + Autoprefixer PostCSS pipeline
└── vite.config.ts              # Dev server and build configuration
```

---

## 🎨 Styling Approach

Styling combines **Tailwind utility classes** with a custom design token system.

### What's in place

| Element | Description |
|---|---|
| 🎨 CSS variables | Global design tokens in `src/index.css` |
| 🧱 Tailwind layers | `base` / `components` / `utilities` via `@tailwind` directives |
| 🧩 Semantic classes | `serene-page-shell`, `serene-card`, `serene-button-primary`, `serene-nav-link` |
| 🔤 Shared primitives | `src/components/common/SerenePrimitives.tsx` |
| 🔡 Fonts | `Inter` + `Manrope` via Google Fonts |

Most pages compose Tailwind utilities directly. The overall visual system is anchored by CSS custom properties and a small set of shared component classes — consistent design language without a separate component library.

---

## 🌍 Build & Deployment

```bash
npm run build
# Output: dist/
```

### Deployment notes

| Concern | Detail |
|---|---|
| 📦 Output directory | `dist/` |
| 🌐 SPA routing | `nginx.conf` uses `try_files ... /index.html` for fallback |
| 🔐 Auth | Depends on backend cookies, CORS policy, and session config |
| 📡 Realtime | Broadcasting requires correct Reverb host/port/scheme config |
| 🏠 Domain setup | Local example uses `covoit.local` with a reverse proxy for API + Reverb |

---

## 🔧 Troubleshooting

### 🔐 Login succeeds but app reverts to guest state

The `AuthProvider` calls `/auth/me` and retries via `/auth/refresh`. If the session doesn't persist:

- Verify backend `SameSite`, `Secure`, and cookie domain settings
- Ensure the frontend domain matches the backend CORS and cookie configuration
- `apiClient` uses `withCredentials: true` — proxy headers must pass cookies through

### 👤 Profile/account calls fail silently

Several person/account APIs read `personId` from `sessionStorage`. If the value is absent, profile and account features fail. Have the user log in again to restore the value.

### 💬 Chat doesn't update in real time

Check the following in order:

1. `VITE_REVERB_*` values match the backend WebSocket setup
2. Backend exposes `/broadcasting/auth` or `/broadcasting/auth-proxy`
3. The authenticated browser session is valid for private channel authorization
4. WebSocket host and scheme are reachable from the browser

> Inbox and conversation polling will still work if Reverb is unavailable.

### 🏠 Dev host issues with `covoit.local`

`vite.config.ts` binds to `127.0.0.1:5173` and allows `covoit.local` as a host. Ensure:

- `/etc/hosts` (or equivalent) resolves `covoit.local` to `127.0.0.1`
- Your reverse proxy correctly routes API and WebSocket traffic

### 📦 Production build fails

```bash
npm run lint    # Check for ESLint errors
npm run build   # TypeScript check + Vite bundle
```

> No test command is configured yet — lint + build are the available in-repo validation steps.

---

<div align="center">

**Built with ❤️ by Obidah Hajjo — Full Stack Developer**

</div>