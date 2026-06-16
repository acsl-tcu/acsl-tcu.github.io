# AGENTS.md

## Purpose
- This repository is the public site for ACSL at Tokyo City University.
- The app is a `Next.js 15` App Router project with `React 19`, `TypeScript`, `Tailwind CSS`, and mixed `tsx`/`jsx` files.
- Deployment targets GitHub Pages via `.github/workflows/nextjs.yml`, so changes must remain compatible with static export behavior.

## Working Rules
- Preserve the current structure unless the task explicitly asks for refactoring. This repo contains newer localized pages and older admin/internal pages side by side.
- Prefer small, local changes. Do not rename or reorganize broad areas such as `app/[locale]`, `app/MSE`, `app/BOS`, or `components/DataTable` unless required.
- Keep imports using the existing `@/*` alias style.
- Maintain existing language usage in UI copy. Public pages are Japanese/English; many admin screens are Japanese-first.
- Do not replace existing external endpoints casually. Several features depend on hard-coded remote services.

## Key Areas
- `app/[locale]`: main public site. Locale pages are statically enumerated by `generateStaticParams()`.
- `app/page.tsx` and `app/lab/page.tsx`: client-side redirects based on `navigator.language`.
- `contexts/i18nContext.tsx` and `constants/i18n.ts`: locale/message source of truth.
- `app/BOS/*`: WebSocket-based Building OS pages.
- `app/MSE/*` and `app/Dashboard/*`: internal timetable/data management UIs, with some legacy naming and mixed JS/TS.
- `hooks/useDB.tsx`: fetches remote database content from `https://acsl-hp.vercel.app/api/read-database-psql`.
- `components/lab/BoxImageUploader.tsx`: uploads to a remote API on `acsl-hp.vercel.app`.

## Static Export Constraints
- Keep GitHub Pages compatibility in mind. The workflow uses `actions/configure-pages` with Next static generation and uploads `./out`.
- Avoid introducing server-only runtime assumptions into public pages.
- Be careful with dynamic routes: `app/[locale]/layout.tsx` sets `dynamicParams = false`, so supported locales must stay aligned with `constants/i18n.ts`.
- When changing navigation or routing, verify that direct static paths like `/{locale}/Home/` still work with `trailingSlash: true`.

## Code Conventions
- Default to TypeScript for new code, but do not churn existing `.jsx` files without need.
- Add `'use client'` only where browser APIs, hooks, or interactivity require it.
- Follow current component patterns rather than introducing a new state/data framework.
- Keep comments minimal and only where they clarify non-obvious behavior.
- Preserve existing file/path casing. Some assets and imports rely on exact names.

## Validation
- Preferred checks:
  - `npm run build`
  - `npm run lint`
- `npm run lint` currently uses `next lint`, which is deprecated in Next.js 15/16-era tooling. Do not silently migrate the lint setup unless the task asks for it.
- If a task touches routing, locale handling, or static generation, prioritize `npm run build`.
- If a task touches remote data or WebSocket features, verify that the UI still fails gracefully when the remote service is unavailable.

## Known Pitfalls
- `README.md` contains some stale setup notes; trust the actual code and workflow over the README when they differ.
- This repo includes legacy and partially inconsistent areas. Do not "clean up" unrelated naming/import issues as incidental work.
- External dependencies are hard-coded in places:
  - Box/DB API: `https://acsl-hp.vercel.app`
  - BOS WebSocket: `wss://bos-wgh5.onrender.com`
- Large media files live under `public/images`; avoid unnecessary churn there.

## When Updating This File
- Keep guidance specific to this repository.
- Prefer practical instructions for future coding agents over generic style advice.
