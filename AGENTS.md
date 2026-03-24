# AGENTS.md

## Scope
- Repository: `covoit-front`
- Stack: React 19, TypeScript, Vite, React Router, Axios, Tailwind CSS
- Package manager: `npm` (`package-lock.json` exists)
- Source root: `src/`
- Build output: `dist/`

## Repository Rules Found
- No Cursor rules were found in `.cursor/rules/`.
- No `.cursorrules` file was found.
- No Copilot instructions were found in `.github/copilot-instructions.md`.
- There was no existing repository `AGENTS.md`.

## Agent Priorities
- Preserve the current architecture before introducing new abstractions.
- Prefer small, focused diffs over opportunistic refactors.
- Match the local style of the file you edit.
- Do not add new libraries, state managers, or test frameworks unless requested.
- When validation is limited, say so clearly in your handoff.

## Setup
```bash
npm install
```

## Core Commands

### Start dev server
```bash
npm run dev
```
- Starts Vite on `127.0.0.1:5173`.
- `covoit.local` is allowed by `vite.config.ts`.

### Build
```bash
npm run build
```
- Runs `tsc -b && vite build`.
- This is the main production verification command.

### Lint
```bash
npm run lint
```
- Runs `eslint .` via `eslint.config.js`.

### Preview build
```bash
npm run preview
```

### Useful direct commands
```bash
npx tsc -b
npx eslint src/path/to/file.tsx
```
- Use `npx eslint src/path/to/file.tsx` to lint one file quickly.
- Use `npx tsc -b` when you want the TypeScript build check without Vite bundling.

## Test Status
- There is no `test` script in `package.json`.
- No Jest, Vitest, or Playwright config was found.
- No `*.test.*` or `*.spec.*` files were found.
- Treat this repo as having no automated test runner configured today.

## Single Test Guidance
- A single test cannot currently be run because no test framework is configured.
- For now, the closest equivalent is targeted linting with `npx eslint src/path/to/file.tsx`.
- For broader verification, run `npm run lint && npm run build`.
- If a test runner is added later, update this file with the exact single-test command immediately.

## Validation Expectations
- Small changes: run `npm run lint`.
- Routing, provider, API, or type-heavy changes: run `npm run lint && npm run build`.
- If a flow depends on backend cookies, env vars, or websockets, mention what could not be verified locally.

## Project Layout
- `src/app`: shared infrastructure, Axios clients, API error helpers, error provider
- `src/providers`: long-lived providers like auth, loading, chat inbox
- `src/context`: contexts
- `src/hooks`: page/domain hooks
- `src/features`: API modules and feature integration code
- `src/pages`: route-level pages
- `src/components/common`: reusable primitives and shared UI
- `src/components/ui`: feature-oriented sections
- `src/router`: route tree and guards
- `src/types`: shared API/domain types
- `src/i18n`: dictionaries, locale config, translation helpers

## Architectural Conventions
- Keep backend calls in `src/features/**` or shared clients under `src/app/**`.
- Use `apiClient` for authenticated internal API calls.
- Use `externalApiClient` for third-party endpoints.
- Keep global loading and error behavior wired through the existing provider/interceptor pattern.
- Use pages as assembly layers; keep reusable logic in hooks, providers, and feature modules.

## Import Conventions
- Use ES module syntax everywhere.
- Prefer relative imports; no path alias is configured.
- Order imports simply: external packages, internal modules, then styles.
- Use `import type` for type-only imports when it improves clarity.
- The repo mixes extensionless imports and `.ts` suffix imports; match the surrounding file instead of normalizing unrelated code.

## Formatting Conventions
- There is no Prettier config in the repo.
- Formatting is inconsistent; preserve the local style of touched files.
- Many newer files use double quotes and semicolons.
- Keep JSX readable; split dense props across lines.
- Avoid reformatting unrelated sections.

## TypeScript Conventions
- TypeScript is strict; `strict`, `noUnusedLocals`, and `noUnusedParameters` are enabled.
- Prefer explicit interfaces and types for shared models in `src/types/**`.
- Prefer `unknown` over `any` for caught errors, then narrow.
- Type exported async functions and context values explicitly.
- Use union types for finite states such as auth status values.
- Use non-null assertions only when lifecycle guarantees make them safe.

## React Conventions
- Use function components.
- Keep hooks at the top level and satisfy the hooks linter.
- Memoize provider values and callbacks passed through context when appropriate.
- Keep route pages thin and declarative.
- Extract repeated UI into shared primitives or section components.

## Naming Conventions
- Components, pages, providers, contexts, types: `PascalCase`
- Hooks: `useSomething`
- Variables and functions: `camelCase`
- Shared constants: `UPPER_SNAKE_CASE`
- File names usually mirror the primary exported symbol; keep that pattern.

## Error Handling
- Normalize API failures with helpers like `extractApiErrorMessage` and `extractApiFieldErrors`.
- Throw clear user-facing `Error` messages from feature API modules.
- Do not assume every caught value is an Axios error.
- Preserve graceful fallback behavior in auth/session refresh flows.
- Use the existing global error context for app-wide feedback.

## API And Network Rules
- Preserve `withCredentials` on authenticated API requests.
- Respect the existing `showGlobalLoader: false` option for silent requests.
- Be careful around the auth endpoints excluded from refresh retry logic.
- Do not casually change request or response shapes; frontend types reflect backend contracts.

## i18n Rules
- Supported locales are `en`, `fr`, and `ar`.
- Prefer `useI18n()` and helpers from `src/i18n/config.ts` for visible copy.
- Do not hardcode new user-facing strings when they belong in the translation dictionaries.
- Keep RTL behavior in mind when editing layout-sensitive components.

## Styling Rules
- Styling is mainly Tailwind utilities plus shared CSS variables and serene primitives.
- Reuse existing design tokens and primitives before adding one-off styles.
- Keep changes visually consistent with nearby screens.
- Prefer editing shared tokens/classes over duplicating literal values.

## Comments And Docs
- Many exported functions and providers use JSDoc.
- Preserve that pattern when changing public behavior.
- Add comments only when they clarify non-obvious logic.

## Change Discipline
- Read nearby files before making structural changes.
- Keep diffs narrow; do not fix unrelated formatting noise.
- When no automated tests exist, state that validation relied on lint/build only.
- If you add a test runner later, update this file with exact repo-specific test commands, especially single-test usage.

## User Guide Generation

### Scope
When generating a user guide document for the carpooling app, follow all rules in this section.
The guide must be a `.docx` Word file with a professional, modern layout that mirrors the app's visual identity.

### Document Structure
- Cover page: app logo (placeholder if unavailable), app name, version, and date.
- Table of contents (auto-generated via Word styles).
- One chapter per major feature area (e.g. Registration, Search a Ride, Offer a Ride, Booking, Profile, Notifications).
- Each chapter follows this exact template:
    1. Chapter title (Heading 1)
    2. One-paragraph overview of the feature
    3. Step-by-step numbered instructions (Heading 2 per step group)
    4. Screenshot placeholder or embedded screenshot for EACH described action
    5. Tips / Notes callout box at the end of the chapter (styled as a colored block)
- Closing chapter: FAQ + Troubleshooting, then a Contact / Support page.

### Visual Identity — Match the App
- Primary color: extract the dominant brand color from `src/` (check Tailwind config, CSS variables, or shared tokens). Use it for chapter heading underlines, callout box backgrounds, and the cover page accent bar.
- Typography: use a clean sans-serif pair — a bold weight for headings, regular for body. Default to Calibri or equivalent if no font is specified.
- Spacing: generous margins (2.5 cm), 1.15 line spacing for body text, 6 pt spacing after paragraphs.
- No decorative clipart; screenshots and icons only.

### Screenshots
- Capture one screenshot per distinct UI action described in the guide.
- Screenshots must be full-page or cropped to the relevant component — never blurry or stretched.
- Embed screenshots inline, centered, with a thin 1 pt border and a caption below (e.g. "Figure 3 — Search results page").
- If a screenshot cannot be captured automatically, insert a clearly labeled placeholder: `[SCREENSHOT: <description>]` styled in italic gray text so it is obvious during review.
- Screenshot filenames must follow the pattern `screenshot-<chapter>-<step>.png` and be stored in `docs/screenshots/`.

### Word Styles Used
The document must use only named Word styles — no direct formatting:
- `Title` → cover page app name
- `Heading 1` → chapter titles
- `Heading 2` → step group titles within a chapter
- `Heading 3` → sub-steps or optional detail sections
- `Normal` → body text
- `Caption` → figure captions below screenshots
- `Intense Quote` → Tips / Notes callout blocks
- `List Number` → numbered step lists
- All styles must be customized to match the brand colors and typography defined above.

### Language and Tone
- The guide targets end users (not developers).
- Write in plain, friendly language. No technical jargon.
- Use the imperative mood for instructions: "Tap the Search button", not "The user should tap…"
- The guide must be available in French (`docs/guide-fr.docx`) as the primary language. Add an English version (`docs/guide-en.docx`) if i18n strings exist for `en`.
- Use the existing `src/i18n/` dictionaries as the authoritative source for UI label names — never invent label names.

### File Output
- Primary output: `docs/guide-fr.docx`
- Secondary output (if English strings exist): `docs/guide-en.docx`
- Screenshots folder: `docs/screenshots/`
- After generation, print a summary of: chapters written, screenshots embedded, screenshots left as placeholders, and any sections that need manual review.

### Validation
- Open the `.docx` in python-docx or equivalent and verify: table of contents exists, all Heading 1 styles are applied, no raw `[SCREENSHOT]` placeholders remain without a note, and the file is not corrupted.
- Report any validation failures clearly.