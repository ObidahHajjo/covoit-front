<div align="center">

<img src="https://img.shields.io/badge/-%F0%9F%9A%97%20COVOIT%20FRONTEND-0a0a0a?style=for-the-badge&labelColor=0a0a0a" />

### Plateforme de Covoiturage — React 19 + TypeScript + Vite

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-PostCSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Laravel_Echo-Reverb-FF2D20?style=flat-square&logo=laravel&logoColor=white&labelColor=0a0a0a" />
  <img src="https://img.shields.io/badge/Nginx-SPA-009639?style=flat-square&logo=nginx&logoColor=white&labelColor=0a0a0a" />
</p>

<p>
  <a href="README.en.md">English</a> &nbsp;|&nbsp; 🌐 <strong>Français</strong> &nbsp;|&nbsp; <a href="README.ar.md">العربية</a>
</p>

</div>

---

> **SPA orientée production** pour une plateforme de covoiturage. Développée avec React 19, TypeScript 5 et Vite 7 — couvrant l'expérience complète conducteur/passager : découverte de trajets, gestion des réservations, outils conducteur, paramètres de compte et chat temps réel via Laravel Reverb.

---

## 📚 Sommaire

- [✨ Vue d'ensemble](#-vue-densemble)
- [🧱 Stack Technique](#-stack-technique)
- [🗺 Fonctionnalités](#-fonctionnalités)
- [🏗 Architecture](#-architecture)
- [🔀 Routage](#-routage)
- [🧠 État & Contexte](#-état--contexte)
- [🔌 Intégration API](#-intégration-api)
- [💬 Chat Temps Réel](#-chat-temps-réel)
- [⚙️ Variables d'environnement](#️-variables-denvironnement)
- [🚀 Démarrage](#-démarrage)
- [🛠 Workflow de développement](#-workflow-de-développement)
- [📜 Scripts disponibles](#-scripts-disponibles)
- [📁 Structure du projet](#-structure-du-projet)
- [🎨 Approche stylistique](#-approche-stylistique)
- [🌍 Build & Déploiement](#-build--déploiement)
- [🔧 Dépannage](#-dépannage)

---

## ✨ Vue d'ensemble

Le frontend Covoit est une SPA React + TypeScript propulsée par Vite, centrée sur le parcours utilisateur connecté :

| Étape | Description |
|---|---|
| 🔐 **Authentification** | Connexion, inscription, mot de passe oublié/réinitialisation |
| 👤 **Compléter le profil** | Étape obligatoire avant d'accéder à l'application |
| 🔍 **Découvrir des trajets** | Recherche de trajets disponibles et consultation des détails |
| 🎟 **Réserver & Gérer** | Réserver des sièges, consulter et annuler ses réservations |
| 🚗 **Conduire** | Publier des trajets, gérer les passagers, annuler des trajets |
| 🏠 **Compte** | Mettre à jour son profil personnel et les informations du véhicule |
| 💬 **Chat** | Échanger des messages avec conducteurs ou passagers en temps réel |

> L'application suppose qu'un backend Laravel compatible est en cours d'exécution. Plusieurs comportements dépendent des cookies de session, des flags de permission, du broadcasting de chat et des contrats d'API.

---

## 🧱 Stack Technique

| Technologie | Version | Rôle |
|---|---|---|
| ⚛️ **React** | 19 | Framework UI |
| 🔷 **TypeScript** | 5 | Typage statique |
| ⚡ **Vite** | 7 | Serveur de dev & bundler |
| 🔀 **React Router DOM** | 7 | Routage côté client |
| 🌐 **Axios** | latest | Client HTTP |
| 📡 **Laravel Echo** | latest | Wrapper client WebSocket |
| 🔌 **pusher-js** | latest | Transport navigateur pour Reverb |
| 🎨 **Tailwind CSS** | via PostCSS | Styles utilitaires |
| ✅ **ESLint** | 9 | Linting |
| 🟩 **Nginx** | latest | Serveur statique SPA en déploiement |

> **Notes :**
> - Tailwind est activé via les directives `@tailwind` dans `src/index.css` et la config PostCSS
> - Aucun fichier de config Tailwind n'est présent dans le dépôt pour l'instant
> - Aucun test runner n'est configuré dans `package.json` pour l'instant

---

## 🗺 Fonctionnalités

```
🔐  Auth ................... connexion · inscription · mot de passe oublié · réinitialisation
🛡  Guards ................. guest-only · gate profil · basés sur les permissions
🏠  Tableau de bord ........ trajets conducteur à venir · réservations à venir
🔍  Découverte ............. recherche · résultats · détail d'un trajet
🎟  Réservations ........... réserver un siège · annuler une réservation
🚗  Outils conducteur ...... publier · gérer · annuler · contacter un passager
👤  Compte ................. gestion du profil · gestion du véhicule
💬  Chat ................... boîte de réception · fil de conversation · mises à jour temps réel
⚠️  Feedback global ........ overlay chargement · alerte d'erreur
```

---

## 🏗 Architecture

L'application utilise une architecture React légère orientée providers. Aucun Redux, Zustand ou React Query — la récupération de données est gérée via des hooks personnalisés et des appels Axios par feature.

### Composition au runtime (`src/App.tsx`)

```
LoadingProvider
  └── AxiosInterceptorProvider
        └── AuthProvider
              └── ChatInboxProvider
                    └── GlobalSpinner + GlobalErrorAlert
                          └── AppRouter
```

### Responsabilités par couche

| Couche | Chemin | Responsabilité |
|---|---|---|
| 🏛 **Infra app** | `src/app/` | Clients Axios, helpers erreurs API, error provider global |
| 🌐 **Providers** | `src/providers/` | État auth, chargement, inbox chat |
| 🔀 **Router** | `src/router/` | Arbre de routes et guards d'accès |
| 📦 **Features** | `src/features/` | Modules API backend et utilitaires chat/temps réel |
| 🧠 **Context** | `src/context/` | Hooks page/domaine et React contexts |
| 📄 **Pages** | `src/pages/` | Composants de page au niveau des routes |
| 🧩 **Components** | `src/components/` | Layout, primitives partagées, sections UI |
| 🔷 **Types** | `src/types/` | Modèles TypeScript API/domaine |

---

## 🔀 Routage

Le routage est défini dans `src/router/AppRouter.tsx` avec `BrowserRouter` et des guards imbriqués.

### 🔓 Routes publiques / invitées
> Enveloppées par `GuestRoute` — redirige les utilisateurs authentifiés hors des écrans d'auth

```
/login
/register
/forgot-password
/reset-password
```

### 👤 Route de complétion du profil
> Activée si `first_name`, `last_name` ou `pseudo` sont absents de l'utilisateur authentifié

```
/complete-profile
```

### 🔒 Routes protégées
> Nécessitent une authentification

```
/home
/find-trip
/find-trip/results
/trips/:tripId
/trips/:tripId/contact-driver
/chat
/chat/:conversationId
```

### 🚗 Routes conducteur
> Nécessitent la permission `can_manage_own_trips`

```
/my-trips
/my-trips/new
/my-trips/:tripId
/my-trips/:tripId/contact-passenger/:passengerId
```

### 🎟 Routes réservations
> Nécessitent la permission `can_view_bookings`

```
/bookings
/bookings/:tripId
```

### ⚙️ Routes compte
> Nécessitent la permission `can_edit_profile`

```
/my-account
```

> La barre de navigation inférieure est consciente des permissions et n'affiche que les sections disponibles pour l'utilisateur courant.

---

## 🧠 État & Contexte

### Providers globaux

| Provider | Responsabilité |
|---|---|
| `AuthProvider` | Résout `/auth/me`, réessaie avec `/auth/refresh`, expose `status`, `user`, `refreshMe`, `logoutLocal` |
| `LoadingProvider` | Suit le nombre de requêtes actives, alimente l'overlay de chargement global |
| `ChatInboxProvider` | Charge les conversations, calcule les compteurs non lus, écoute les mises à jour temps réel, rafraîchit par intervalle |
| `ErrorProvider` | Maintient l'état d'erreur global pour `GlobalErrorAlert` |

### Hooks page/domaine (`src/context/`)

| Hook | Rôle |
|---|---|
| `useHome` | Données du tableau de bord |
| `useTripResults` / `useTripDetails` | Flux de découverte de trajets |
| `useMyTrips` / `usePublishTrip` / `useDriverTripDetails` | Workflows conducteur |
| `useMyBookings` / `useBookingDetails` | Workflows réservation passager |
| `useMyAccount` | Gestion profil + véhicule |
| `useChatConversation` | Fils de messages |
| `useLogin` / `useRegister` | Formulaires d'auth |

### Utilisation du stockage

| Store | Clé | Usage |
|---|---|---|
| `sessionStorage` | `personId` | Stocké après connexion — utilisé par les appels API personne/compte |
| `localStorage` | refresh token | Stocké par le flux de connexion pour la continuité de session |
| `localStorage` | état lecture chat | Métadonnées non-lus par scope de session utilisateur |

---

## 🔌 Intégration API

### Client API interne (`src/app/apiClient.ts`)

- URL de base depuis `VITE_API_BASE_URL`
- `Content-Type: application/json`
- `withCredentials: true` pour l'auth basée sur les cookies
- Retry automatique en cas de 401 via `/auth/refresh` pour les endpoints non-auth

### Client API externe (`src/app/externalApiClient.ts`)

Un second client Axios sans credentials, utilisé pour :

| Service | URL |
|---|---|
| 🗺 Recherche de commune | `https://geo.api.gouv.fr` |
| 📍 Géocodage d'adresse | `https://data.geopf.fr/geocodage/search` |

### Modules feature

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

### Endpoints backend attendus

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

## 💬 Chat Temps Réel

Le chat utilise une stratégie **hybride temps réel + polling** pour la résilience.

### Stack

| Composant | Technologie |
|---|---|
| Client Echo | `src/features/chat/chatEcho.ts` |
| Transport | `pusher-js` (compatible Reverb) |
| Auth | Auth canal privé via le backend |

### Canaux

```
chat.user.{personId}          ← mises à jour niveau inbox
chat.conversation.{id}        ← messages niveau conversation
```

Écoute les événements `.chat.message.sent`.

### Fallback polling

| Périmètre | Intervalle |
|---|---|
| Inbox | toutes les **8 secondes** |
| Conversation active | toutes les **5 secondes** |

### État non-lu

- Persisté dans `localStorage` par scope de session utilisateur
- Compteurs non-lus affichés dans la navigation inférieure
- Marqué comme lu à l'ouverture de la conversation
- Cartes d'alerte de message entrant affichées temporairement

> Si le broadcasting n'est pas disponible, le polling maintient le chat fonctionnel — mais les indicateurs temps réel et le statut de connexion peuvent ne pas se comporter comme attendu.

---

## ⚙️ Variables d'environnement

Copier depuis `.env.example` et adapter à votre environnement :

```bash
cp .env.example .env.local
```

| Variable | Requise | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ Oui | URL de base de l'API backend |
| `VITE_REVERB_APP_KEY` | ⚡ Temps réel | Clé publique Reverb pour Laravel Echo |
| `VITE_REVERB_HOST` | ⚡ Temps réel | Hostname WebSocket (côté navigateur) |
| `VITE_REVERB_PORT` | Optionnel | Fallback port HTTP/WS partagé |
| `VITE_REVERB_WS_PORT` | Optionnel | Port WebSocket non-TLS explicite |
| `VITE_REVERB_WSS_PORT` | Optionnel | Port WebSocket TLS explicite |
| `VITE_REVERB_SCHEME` | Optionnel | `http` ou `https` |

**Config locale exemple :**

```env
VITE_API_BASE_URL=http://covoit.local
VITE_REVERB_APP_KEY=local-key
VITE_REVERB_HOST=covoit.local
VITE_REVERB_PORT=80
VITE_REVERB_WS_PORT=80
VITE_REVERB_WSS_PORT=443
VITE_REVERB_SCHEME=http
```

> Utilisez `.env.local` ou `.env` pour la config locale — les deux sont gitignorés.

---

## 🚀 Démarrage

### Prérequis

- **Node.js** 18+
- **npm** (le dépôt inclut `package-lock.json`)
- Un backend compatible avec les contrats d'API et de broadcasting attendus

### Installer les dépendances

```bash
npm install
```

### Configurer l'environnement

```bash
cp .env.example .env.local
# Éditer .env.local selon votre configuration locale
```

### Démarrer le serveur de développement

```bash
npm run dev
```

Config du serveur dev Vite (`vite.config.ts`) :

| Paramètre | Valeur |
|---|---|
| Host | `127.0.0.1` |
| Port | `5173` |
| Host autorisé | `covoit.local` |

> Si vous utilisez le hostname `covoit.local`, configurez votre `/etc/hosts` et votre proxy local en conséquence.

---

## 🛠 Workflow de développement

```bash
# 1. Démarrer le backend/API + services de broadcasting
# 2. Créer/mettre à jour .env.local
# 3. Installer les dépendances
npm install

# 4. Démarrer le serveur de dev
npm run dev

# 5. Linter avant de committer
npm run lint

# 6. Vérifier la préparation pour la production
npm run build
```

> ⚠️ Aucun script de test automatisé n'est configuré pour l'instant. Le linting et les builds de production sont les étapes de validation principales disponibles dans le dépôt.

---

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Exécute `tsc -b && vite build` — vérification TypeScript + bundle |
| `npm run lint` | Exécute `eslint .` |
| `npm run preview` | Sert le build de production localement |

---

## 📁 Structure du projet

```
covoit-front/
│
├── public/                     # Assets statiques publics
│
├── src/
│   ├── app/                    # Clients Axios, helpers erreurs, error provider global
│   ├── assets/                 # Images et assets statiques frontend
│   ├── auth/                   # Helpers de vérification complétion profil
│   │
│   ├── components/
│   │   ├── common/             # Primitives UI réutilisables et composants de feedback
│   │   ├── layout/             # Shell de l'app et navigation inférieure
│   │   └── ui/                 # Sections de présentation orientées feature
│   │
│   ├── context/                # Hooks page/domaine et React contexts
│   ├── features/               # Modules API et utilitaires réel-time/chat
│   ├── pages/                  # Composants de page au niveau des routes
│   ├── providers/              # Providers app-wide long-lived
│   ├── router/                 # Config des routes et guards d'accès
│   ├── types/                  # Modèles TypeScript API/domaine
│   │
│   ├── App.tsx                 # Composition des providers racine
│   ├── bootstrap.ts            # Setup des intercepteurs Axios de chargement
│   ├── index.css               # Tokens de thème global + layers Tailwind
│   └── main.tsx                # Point d'entrée de l'app
│
├── .env.example                # Variables d'env Vite documentées
├── eslint.config.js            # Config ESLint flat
├── nginx.conf                  # Serveur statique SPA (fallback try_files)
├── package.json                # Scripts et dépendances
├── postcss.config.js           # Pipeline PostCSS Tailwind + Autoprefixer
└── vite.config.ts              # Configuration serveur dev et build
```

---

## 🎨 Approche stylistique

Le style combine des **classes utilitaires Tailwind** avec un système de tokens de design personnalisé.

### Ce qui est en place

| Élément | Description |
|---|---|
| 🎨 Variables CSS | Tokens de design globaux dans `src/index.css` |
| 🧱 Layers Tailwind | `base` / `components` / `utilities` via directives `@tailwind` |
| 🧩 Classes sémantiques | `serene-page-shell`, `serene-card`, `serene-button-primary`, `serene-nav-link` |
| 🔤 Primitives partagées | `src/components/common/SerenePrimitives.tsx` |
| 🔡 Polices | `Inter` + `Manrope` via Google Fonts |

La plupart des pages composent directement des utilitaires Tailwind. Le système visuel global est ancré par des propriétés CSS personnalisées et un petit ensemble de classes de composants partagées — un langage de design cohérent sans bibliothèque de composants séparée.

---

## 🌍 Build & Déploiement

```bash
npm run build
# Sortie : dist/
```

### Notes de déploiement

| Point | Détail |
|---|---|
| 📦 Répertoire de sortie | `dist/` |
| 🌐 Routage SPA | `nginx.conf` utilise `try_files ... /index.html` pour le fallback |
| 🔐 Auth | Dépend des cookies backend, de la politique CORS et de la config de session |
| 📡 Temps réel | Le broadcasting nécessite une config correcte host/port/scheme de Reverb |
| 🏠 Domaine | L'exemple local utilise `covoit.local` avec un reverse proxy pour API + Reverb |

---

## 🔧 Dépannage

### 🔐 La connexion réussit mais l'app revient en état invité

Le `AuthProvider` appelle `/auth/me` et réessaie via `/auth/refresh`. Si la session ne persiste pas :

- Vérifier les paramètres `SameSite`, `Secure` et le domaine des cookies backend
- S'assurer que le domaine frontend correspond à la config CORS et cookies backend
- `apiClient` utilise `withCredentials: true` — les headers proxy doivent transmettre les cookies

### 👤 Les appels profil/compte échouent silencieusement

Plusieurs APIs personne/compte lisent `personId` depuis `sessionStorage`. Si la valeur est absente, les fonctionnalités de profil et de compte échouent. Faire se reconnecter l'utilisateur pour restaurer la valeur.

### 💬 Le chat ne se met pas à jour en temps réel

Vérifier dans l'ordre :

1. Les valeurs `VITE_REVERB_*` correspondent au setup WebSocket backend
2. Le backend expose `/broadcasting/auth` ou `/broadcasting/auth-proxy`
3. La session navigateur authentifiée est valide pour l'autorisation des canaux privés
4. Le host et le scheme WebSocket sont accessibles depuis le navigateur

> L'inbox et le polling des conversations fonctionnent toujours si Reverb n'est pas disponible.

### 🏠 Problèmes de host dev avec `covoit.local`

`vite.config.ts` lie le serveur à `127.0.0.1:5173` et autorise `covoit.local` comme host. S'assurer que :

- `/etc/hosts` (ou équivalent) résout `covoit.local` vers `127.0.0.1`
- Votre reverse proxy route correctement le trafic API et WebSocket

### 📦 Le build de production échoue

```bash
npm run lint    # Vérifier les erreurs ESLint
npm run build   # Vérification TypeScript + bundle Vite
```

> Aucune commande de test n'est configurée pour l'instant — lint + build sont les étapes de validation disponibles dans le dépôt.

---

<div align="center">

**Développé avec ❤️ par Obidah Hajjo — Développeur Full Stack**

</div>