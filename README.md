# Panagiotis Zois — Portfolio

My personal developer portfolio: a single-page Angular app that presents who I am, what I work with, my professional/academic timeline and how to get in touch.

Live sections: **Home · About · Skills · My Journey · Contact**, plus a standalone **Certifications** page.

## Features

- **Standalone, signal-based Angular components** (Angular 22) — no NgModules, `OnPush` change detection throughout.
- **Floating desktop navigation** with scroll-spy (`IntersectionObserver`), a draggable position, and a smooth transition from a centered dock at the top of the page to a docked left-side rail once you scroll. Collapses into a hamburger menu on mobile.
- **EN / EL localization** through a lightweight custom `TranslateService` and pipe backed by JSON dictionaries (`public/i18n/en.json`, `public/i18n/el.json`).
- **Supabase-backed assets** — profile images and documents are served from Supabase Storage via `AssetService`, with support for public URLs, signed URLs and on-the-fly image transforms.
- **Tailwind CSS 4** utility-first styling with a dark, neon-glass aesthetic.
- **Timeline component** covering career and education history, with expandable entries.
- Deployed as a static SPA on **Netlify** (`public/_redirects` handles client-side routing).

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Angular 22 (standalone components, signals, `@if`/`@for` control flow) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Data / Storage | Supabase (Storage + client SDK) |
| i18n | Custom `TranslateService` / `TranslatePipe` |
| Testing | Vitest |
| Hosting | Netlify |

## Getting started

Install dependencies:

```bash
npm install
```

Start a local dev server (auto-reloads on file changes):

```bash
npm start
```

Then open `http://localhost:4200`.

### Build

```bash
npm run build
```

Production artifacts are emitted to `dist/portfolio`.

### Tests

```bash
npm test
```

Runs the unit test suite with Vitest.

## Project structure

```text
src/app/
├── Components/        # Navbar, hero, about, skills, timeline, footer, loading spinner
├── Services/           # AssetService (Supabase-backed asset/image loading)
├── pages/               # mainPage (home) and certifications route
├── environments/       # Environment configuration (Supabase keys, etc.)
├── translate.service.ts / translate.pipe.ts   # i18n
public/
├── i18n/               # en.json / el.json dictionaries
├── _redirects           # Netlify SPA redirect rule
```

## Environment variables

Supabase credentials are read from `src/app/environments/environment.dev.ts` (`supabaseUrl`, `supabaseAnonKey`). Provide your own Supabase project values if you fork this repository.
