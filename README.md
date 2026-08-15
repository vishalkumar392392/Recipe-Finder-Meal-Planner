# Table & Thyme — Recipe Finder & Meal Planner

A SvelteKit 2 / Svelte 5 recipe discovery app paired with a reusable StencilJS web-component library.

## Requirements

- Node.js 20 or newer
- An npm account for publishing the component package

## Run locally

```bash
npm install
npm run build:ui
npm run dev
```

The app uses [TheMealDB](https://www.themealdb.com/api.php), which needs no API key. Local recipes, favorites, and meal plans are retained in browser `localStorage`, so they are not shared across devices.

## Component library

The reusable Stencil package lives in `packages/recipe-ui` and is configured as `@vishalkumar392/recipe-ui` version `0.1.0`. Publish it with:

```bash
npm login
npm run publish:ui
```

The app is configured to consume release version `^0.1.0` from npm, rather than the local library source. Its published package link is `https://www.npmjs.com/package/@vishalkumar392/recipe-ui`.

The library's `recipe-card` and `planner-day` components receive values through properties, emit composed custom events consumed by Svelte, and expose slots for application-provided content.

## Deploy

Import the repository into Vercel and set its Root Directory to `apps/web`. Set the build command to `npm run build`; the project uses the SvelteKit Vercel adapter with the Node.js 20 runtime. No application environment variables are necessary.

## Assumptions

- TheMealDB provides keyword search, category browsing, and cuisine filtering; nutrition and arbitrary multi-filter search are not available.
- Each day has one planned meal; selecting a new one replaces the earlier assignment.
- User-created recipes are available in recipe detail, favorites, and the planner.
- Repository and deployment URLs are intentionally left for the project owner to add after publishing/deployment.
