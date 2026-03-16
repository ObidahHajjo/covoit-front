# 🚗 Covoit-Front

> A carpooling (covoiturage) web application built with React, TypeScript, and Vite.

---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)

---

## About

**Covoit-Front** is the frontend of a carpooling platform, allowing users to offer or search for shared rides. It provides a responsive and modern UI for managing trips, connecting drivers with passengers.

---

## Tech Stack

| Technology        | Version / Notes                          |
|-------------------|------------------------------------------|
| React             | UI library                               |
| TypeScript        | Static typing (97.8% of codebase)        |
| Vite              | Fast build tool with HMR                 |
| Tailwind CSS      | Utility-first CSS framework              |
| ESLint            | Code linting                             |
| PostCSS           | CSS processing                           |

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ObidahHajjo/covoit-front.git
cd covoit-front
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the `.env` file and update the values as needed:

```bash
cp .env .env.local
```

See the [Environment Variables](#environment-variables) section for details.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## Project Structure

```
covoit-front/
├── public/               # Static assets
├── src/                  # Application source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components / routes
│   ├── services/         # API calls and business logic
│   ├── types/            # TypeScript type definitions
│   └── main.tsx          # Application entry point
├── .env                  # Environment variables
├── index.html            # HTML entry point
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project metadata and scripts
```

---

## Environment Variables

The project uses a `.env` file at the root. Key variables to configure:

| Variable           | Description                            |
|--------------------|----------------------------------------|
| `VITE_API_BASE_URL` | Base URL of the backend API            |

> ⚠️ Never commit sensitive values. Use `.env.local` for local overrides (it is gitignored).

---

## Available Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start the development server with HMR    |
| `npm run build`   | Build the app for production             |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint to check for code issues      |

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is not yet licensed. Contact the author for more information.

---

*Made with ❤️ by [ObidahHajjo](https://github.com/ObidahHajjo)*