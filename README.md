# Covoit Frontend

Production-oriented frontend for a carpooling application. This project provides the authenticated rider/driver experience for account access, profile completion, trip discovery, booking management, driver trip management, and in-app chat.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Application Architecture](#application-architecture)
- [Routing](#routing)
- [State and Context Organization](#state-and-context-organization)
- [API Integration](#api-integration)
- [Realtime Chat Behavior](#realtime-chat-behavior)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Styling Approach](#styling-approach)
- [Build and Deployment Notes](#build-and-deployment-notes)
- [Troubleshooting](#troubleshooting)

## Overview

This repository contains the frontend for the Covoit application, built as a Vite-powered React + TypeScript single-page app.

The current codebase is centered around a logged-in user journey:

- authenticate with a backend session
- complete a required personal profile
- search available trips
- reserve seats and review bookings
- publish and manage driver trips
- maintain account and vehicle information
- exchange messages through an in-app chat system

The application assumes a compatible backend is available. Several behaviors in this frontend depend on backend session cookies, permission flags, chat broadcasting, and API route contracts.

## Tech Stack

The repository currently uses:

- React 19
- TypeScript 5
- Vite 7
- React Router DOM 7
- Axios
- Laravel Echo
- `pusher-js` as the browser transport used by Laravel Reverb/Echo
- Tailwind CSS via PostCSS
- Autoprefixer
- ESLint 9
- Nginx for static SPA serving in deployment images (`nginx.conf`)

Notes:

- Tailwind is enabled through `@tailwind` directives in `src/index.css` and the PostCSS pipeline in `postcss.config.js`.
- There is no repository-local Tailwind config file at the moment.
- There is no test runner configured in `package.json` right now.

## Core Features

- Authentication flows: login, register, forgot password, reset password
- Session-aware protected routing with guest-only and permission-based guards
- Mandatory profile completion gate before entering the main app
- Home dashboard with upcoming driver trips and bookings
- Trip search and trip detail flows
- Trip reservation and reservation cancellation
- Driver trip publishing and trip cancellation
- Account management for personal profile and vehicle details
- Chat inbox and conversation screens
- Realtime chat updates with a polling fallback strategy
- Global loading and global error feedback layers

## Application Architecture

The app uses a lightweight React architecture based on providers, route guards, feature APIs, and page-specific hooks.

### Runtime composition

Top-level composition in `src/App.tsx` is:

1. `LoadingProvider`
2. `AxiosInterceptorProvider`
3. `AuthProvider`
4. `ChatInboxProvider`
5. global UI overlays (`GlobalSpinner`, `GlobalErrorAlert`)
6. router (`AppRouter`)

### Layering approach

- `src/app`: shared infrastructure such as Axios clients, API error helpers, and the global error provider
- `src/providers`: long-lived app-wide providers for auth, loading, and chat inbox state
- `src/router`: route tree and access guards
- `src/features`: backend-facing API modules and chat realtime utilities
- `src/context`: page/domain hooks and React contexts used by UI screens
- `src/pages`: route-level page components
- `src/components`: layout, shared primitives, and UI sections
- `src/types`: TypeScript API/domain models

This codebase does not use Redux, Zustand, React Query, or another centralized data store. Data fetching and mutation are handled with custom hooks and feature-specific Axios calls.

## Routing

Routing is defined in `src/router/AppRouter.tsx` with `BrowserRouter` and nested guards.

### Public and guest routes

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

These are wrapped by `GuestRoute`, which redirects authenticated users away from auth screens.

### Profile completion route

- `/complete-profile`

Profile completion is enforced by checking whether the authenticated user has the required `first_name`, `last_name`, and `pseudo` values.

### Protected routes

- `/home`
- `/find-trip`
- `/find-trip/results`
- `/trips/:tripId`
- `/trips/:tripId/contact-driver`
- `/chat`
- `/chat/:conversationId`

### Permission-gated routes

Driver capability (`can_manage_own_trips`):

- `/my-trips`
- `/my-trips/new`
- `/my-trips/:tripId`
- `/my-trips/:tripId/contact-passenger/:passengerId`

Booking capability (`can_view_bookings`):

- `/bookings`
- `/bookings/:tripId`

Account editing capability (`can_edit_profile`):

- `/my-account`

The bottom navigation is also permission-aware and only shows sections available to the current user.

## State and Context Organization

### Global providers

- `AuthProvider`: resolves `/auth/me`, attempts `/auth/refresh` when needed, and exposes `status`, `user`, `refreshMe`, and `logoutLocal`
- `LoadingProvider`: tracks active request count and powers the global loading overlay
- `ChatInboxProvider`: loads conversations, computes unread counts, listens for realtime inbox updates, and refreshes on an interval
- `ErrorProvider`: holds app-wide error state for `GlobalErrorAlert`

### Page/domain hooks

The app organizes most screen logic in `src/context/**` hooks, for example:

- `useHome` for dashboard data
- `useTripResults` and `useTripDetails` for trip discovery flows
- `useMyTrips`, `usePublishTrip`, and `useDriverTripDetails` for driver workflows
- `useMyBookings` and `useBookingDetails` for rider booking workflows
- `useMyAccount` for profile + car management
- `useChatConversation` for message threads
- `useLogin` and `useRegister` for auth forms

This keeps page components thin while preserving domain logic close to the relevant UI.

### Storage usage

- `sessionStorage`: stores `personId` after login and is used by several person/account API calls
- `localStorage`: stores the refresh token and chat read/unread state metadata

The refresh token is stored client-side by the login flow, but session continuity still depends on backend cookie/session configuration.

## API Integration

### Internal API client

`src/app/apiClient.ts` defines the authenticated Axios instance:

- base URL from `VITE_API_BASE_URL`
- JSON request headers
- `withCredentials: true` for cookie-based auth/session handling
- automatic 401 retry using `/auth/refresh` for non-auth endpoints

### External API client

`src/app/externalApiClient.ts` defines a second Axios client for third-party APIs without credentials.

It is currently used for:

- commune search via `https://geo.api.gouv.fr`
- address search via `https://data.geopf.fr/geocodage/search`

### Feature modules

Backend calls are grouped by feature:

- `src/features/auth/authApi.ts`
- `src/features/auth/passwordApi.ts`
- `src/features/trips/tripApi.ts`
- `src/features/person/personApi.ts`
- `src/features/cars/carApi.ts`
- `src/features/brands/brandApi.ts`
- `src/features/chat/chatApi.ts`
- `src/features/contact/contactApi.ts`
- `src/features/geo/geoApi.ts`

### Expected backend capabilities

Based on the current frontend implementation, the backend is expected to provide endpoints such as:

- `/auth/login`, `/auth/register`, `/auth/me`, `/auth/refresh`, `/auth/logout`
- `/auth/forgot-password`, `/auth/reset-password`
- `/persons/:id`, `/persons/:id/trips-driver`, `/persons/:id/trips-passenger`
- `/trips`, `/trips/:tripId`, `/trips/:tripId/person`, `/trips/:tripId/contact-driver`
- `/my-trips/:tripId/contact-passenger/:personId`
- `/cars`, `/cars/:id`, `/cars/search`
- `/brands`
- `/conversations`, `/conversations/:id`, `/conversations/:id/messages`
- `/broadcasting/auth` and `/broadcasting/auth-proxy`

Route names and response payloads are backend contracts; verify them against the Laravel API if you change either side.

## Realtime Chat Behavior

Chat is implemented as a hybrid realtime + polling system.

### Realtime stack

- Laravel Echo client in `src/features/chat/chatEcho.ts`
- `pusher-js` transport
- Reverb broadcaster configuration driven by Vite env variables
- private channel subscriptions through backend auth endpoints

### Current channel usage

- inbox-level user channel: `chat.user.{personId}`
- conversation-level channel: `chat.conversation.{conversationId}`

The frontend listens for `.chat.message.sent` events.

### Fallback / refresh strategy

- inbox refresh every 8 seconds
- active conversation refresh every 5 seconds
- realtime events trigger silent reloads

### Unread behavior

Unread state is persisted in `localStorage` per user session scope using `src/features/chat/chatReadState.ts`.

The UI currently supports:

- unread counts in bottom navigation
- read markers when a conversation is opened
- transient incoming-message alert cards
- connection status surfaced to chat screens

If broadcasting is not correctly configured on the backend, chat should still refresh through polling, but live updates and connection indicators may not behave as expected.

## Environment Variables

Example values are documented in `.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL for the backend API used by the authenticated Axios client |
| `VITE_REVERB_APP_KEY` | Required for realtime | Public Reverb app key used by Laravel Echo |
| `VITE_REVERB_HOST` | Required for realtime | Hostname used by the browser for websocket connections |
| `VITE_REVERB_PORT` | Optional | Shared HTTP/websocket port fallback |
| `VITE_REVERB_WS_PORT` | Optional | Explicit non-TLS websocket port |
| `VITE_REVERB_WSS_PORT` | Optional | Explicit TLS websocket port |
| `VITE_REVERB_SCHEME` | Optional | `http` or `https`, used to determine TLS behavior |

Example local configuration:

```env
VITE_API_BASE_URL=http://covoit.local
VITE_REVERB_APP_KEY=local-key
VITE_REVERB_HOST=covoit.local
VITE_REVERB_PORT=80
VITE_REVERB_WS_PORT=80
VITE_REVERB_WSS_PORT=443
VITE_REVERB_SCHEME=http
```

Important:

- use `.env.local` or `.env` for local setup; `.env` is gitignored and `*.local` is ignored as well
- realtime values only matter if the backend actually exposes Laravel Reverb/broadcasting for this frontend
- if your backend uses a different host, cookie domain, or proxy layout, update these values accordingly

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm (the repository includes `package-lock.json`)
- a running backend compatible with the API and broadcasting contracts expected by this frontend

### Installation

```bash
npm install
```

### Configure environment

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Adjust values to match your local backend, websocket host, and scheme.

### Start the development server

```bash
npm run dev
```

Vite is configured in `vite.config.ts` to run on:

- host: `127.0.0.1`
- port: `5173`
- allowed host: `covoit.local`

If you use the `covoit.local` hostname locally, make sure your hosts file and local proxy setup resolve it correctly.

## Development Workflow

Typical local workflow:

1. Start the backend/API and broadcasting services.
2. Create or update `.env.local`.
3. Install dependencies with `npm install`.
4. Run the frontend with `npm run dev`.
5. Lint before committing with `npm run lint`.
6. Build a production bundle with `npm run build` to verify release readiness.

Useful commands from the current repository:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Because there is no automated test script configured right now, linting and production builds are the main built-in validation steps.

## Available Scripts

Scripts come directly from `package.json`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs `tsc -b && vite build` |
| `npm run lint` | Runs `eslint .` |
| `npm run preview` | Serves the production build locally with Vite |

## Project Structure

High-level structure of the current repository:

```text
covoit-front/
├── public/                  # Static public assets
├── src/
│   ├── app/                 # Shared app infrastructure and error handling
│   ├── assets/              # Local images and static frontend assets
│   ├── auth/                # Auth-related helpers such as profile completion checks
│   ├── components/
│   │   ├── common/          # Reusable UI primitives and shared feedback components
│   │   ├── layout/          # App shell and bottom navigation
│   │   └── ui/              # Feature-oriented presentation sections
│   ├── context/             # Page/domain hooks and React contexts
│   ├── features/            # API modules and realtime/chat utilities
│   ├── pages/               # Route-level page components
│   ├── providers/           # Long-lived app providers
│   ├── router/              # Route config and route guards
│   ├── types/               # API/domain TypeScript types
│   ├── App.tsx              # Root app composition
│   ├── bootstrap.ts         # Axios loading interceptors
│   ├── index.css            # Global theme tokens and Tailwind layers
│   └── main.tsx             # App entry point
├── .env.example             # Example Vite environment variables
├── eslint.config.js         # ESLint flat config
├── nginx.conf               # SPA static serving config
├── package.json             # Scripts and dependencies
├── postcss.config.js        # Tailwind + Autoprefixer PostCSS pipeline
└── vite.config.ts           # Vite dev server configuration
```

## Styling Approach

Styling is a mix of Tailwind utility classes and shared custom design tokens.

### What is in place today

- global CSS variables in `src/index.css`
- Tailwind base/components/utilities layers
- reusable semantic utility classes such as `serene-page-shell`, `serene-card`, `serene-button-primary`, and `serene-nav-link`
- shared UI primitives in `src/components/common/SerenePrimitives.tsx`
- imported Google fonts (`Inter` and `Manrope`)

### Practical implication

Most pages compose Tailwind utilities directly, while the overall visual system is anchored by CSS custom properties and a small set of shared component classes. This gives the app a consistent design language without introducing a separate component library.

## Build and Deployment Notes

- `npm run build` outputs the production bundle to `dist/`
- `nginx.conf` is configured for SPA fallback routing with `try_files ... /index.html`
- the frontend is suitable for static hosting as long as API and websocket endpoints are reachable from the browser
- authenticated behavior depends on backend cookies, CORS policy, and broadcasting configuration

For local environments, the example setup suggests a frontend/backend domain such as `covoit.local`, potentially with a reverse proxy handling API and Reverb traffic.

## Troubleshooting

### Login succeeds but the app returns to guest state

Check backend cookie/session settings first.

- `apiClient` uses `withCredentials: true`
- `AuthProvider` calls `/auth/me` and may try `/auth/refresh`
- the login hook expects the session to be restorable after authentication

If cookies, domains, `SameSite`, CORS, or proxy headers are incorrect, the frontend will not stay authenticated.

### Account/profile calls fail with missing person information

Several person/account APIs read `personId` from `sessionStorage`. If that value is absent, profile and account features can fail until the user logs in again.

### Chat does not update in realtime

Verify all of the following:

- `VITE_REVERB_*` values match the backend/websocket setup
- the backend exposes broadcasting auth endpoints
- the authenticated browser session is valid for private channel authorization
- the websocket host and scheme are reachable from the browser

If realtime is unavailable, inbox and conversation polling still provide periodic refreshes.

### Development host issues with `covoit.local`

`vite.config.ts` allows `covoit.local` as a host while binding the dev server to `127.0.0.1:5173`. If you rely on the custom domain locally, make sure your hosts file and reverse proxy setup are aligned.

### Production build issues

Run the repository's built-in checks:

```bash
npm run lint
npm run build
```

There is no test command configured in the current project, so build + lint are the primary verification steps available in-repo.
