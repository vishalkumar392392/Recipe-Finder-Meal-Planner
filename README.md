# Table & Thyme — Recipe Finder & Meal Planner

Table & Thyme is a recipe discovery and weekly meal-planning application built with **SvelteKit 2**, **Svelte 5**, and a reusable **StencilJS** web-component library. It combines recipes from [TheMealDB](https://www.themealdb.com/api.php) with recipes created in the browser, so users can discover dishes, save favorites, and organize a seven-day plan in one place.

- Live app: [recipe-finder-meal-planner-web.vercel.app](https://recipe-finder-meal-planner-web.vercel.app)
- Source repository: [vishalkumar392392/Recipe-Finder-Meal-Planner](https://github.com/vishalkumar392392/Recipe-Finder-Meal-Planner)
- Published component package: [@vishalkumar392/recipe-ui on npm](https://www.npmjs.com/package/@vishalkumar392/recipe-ui)

## Features

- Search TheMealDB recipes by keyword.
- Browse recipes by category and narrow results by cuisine.
- Open a dedicated recipe page with ingredients and step-by-step instructions.
- Save or remove favorite API and user-created recipes.
- Create, edit, validate, and delete personal recipes.
- Assign a recipe to each day of the week, replace an existing assignment, or remove it.
- Keep personal recipes, favorites, and meal-plan assignments between browser sessions.

## Technology

| Area              | Implementation                                                     |
| ----------------- | ------------------------------------------------------------------ |
| Application       | SvelteKit 2, Svelte 5, TypeScript, Vite                            |
| Deployment        | Vercel adapter with Node.js 20 runtime                             |
| Recipe data       | TheMealDB public API, accessed through a SvelteKit server endpoint |
| Local state       | Svelte writable store backed by `localStorage`                     |
| Component library | StencilJS package, `@vishalkumar392/recipe-ui`                     |
| Tests             | Vitest                                                             |

## Project structure

```text
.
├── apps/web/                   # SvelteKit application
│   └── src/
│       ├── routes/             # Discovery, detail, favorites, planner, and personal-recipe pages
│       └── lib/                # API client, local store, shared types, and UI composition
├── packages/recipe-ui/         # Source for the reusable Stencil component package
├── Assigment.md                # Original project brief
└── package.json                # Workspace-level scripts
```

## Prerequisites

- Node.js 20 or later
- npm

No API key or application environment variables are required. TheMealDB is used through the app's `/api/meals` endpoint, which only permits the recipe operations used by the UI.

## Getting started

Install the workspace dependencies, build the Stencil library, then start the SvelteKit development server:

```bash
npm install
npm run build:ui
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The app imports the released `@vishalkumar392/recipe-ui` package; building `packages/recipe-ui` is useful when working on or verifying the component library itself.

## Available scripts

Run these from the repository root:

| Command                | Purpose                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start the SvelteKit development server.                                                                          |
| `npm run build:ui`     | Build the Stencil component package.                                                                             |
| `npm run build`        | Build the component package, then create a production SvelteKit build.                                           |
| `npm test`             | Run all available workspace tests.                                                                               |
| `npm run format:check` | Check formatting with Prettier.                                                                                  |
| `npm run format`       | Format repository files with Prettier.                                                                           |
| `npm run publish:ui`   | Build and publish `@vishalkumar392/recipe-ui` to npm. Requires an authenticated npm account with package access. |

For web-app-only commands, use `npm --workspace=@vishalkumar392/web run check`, `npm --workspace=@vishalkumar392/web run test`, or `npm --workspace=@vishalkumar392/web run preview`.

## Application guide

### Discover recipes

The home page provides keyword search, category browsing, and cuisine filtering. Search and category requests are sent from the browser to `/api/meals`; the endpoint forwards supported requests to TheMealDB and returns an error if the remote service is unavailable. Recipe results are normalized into one common shape before they reach the UI.

### View, save, and plan recipes

Select a recipe card to view its ingredients and instructions. From its detail page, users can save it as a favorite and assign it to a selected weekday. The Favorites page restores the details for saved remote recipes, while the Planner page restores recipes that have been assigned to the week.

### Manage personal recipes

Use **Create recipe** to add a personal recipe. A save requires:

- a non-empty title;
- at least one ingredient; and
- at least one instruction.

Personal recipes use IDs prefixed with `local-`, are editable from their recipe detail page, and can be deleted. Deleting one also removes any matching favorite and every matching weekly-plan assignment.

## Persistence and data limitations

Personal recipes, favorite IDs, and weekly assignments are stored in the current browser under the `recipe-planner:v1` `localStorage` key. This data is not synced to a backend, shared between devices, or available after the browser's local storage is cleared.

TheMealDB determines which remote recipes, categories, cuisines, images, ingredients, and instructions are available. Network access is required to browse or retrieve remote recipe details. The app does not claim to provide nutrition data or arbitrary multi-field API searching.

## Reusable Stencil component library

The SvelteKit app consumes the published package instead of importing local component source. On client startup, it registers the custom elements with `defineCustomElements()`.

The package contains two Shadow DOM components:

| Component     | Role                                       | Svelte integration                                                                                        |
| ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `recipe-card` | Displays a recipe summary and saved state. | Receives recipe data as properties and emits composed `recipeSelected` and `favoriteChanged` events.      |
| `planner-day` | Displays one daily plan assignment.        | Receives day and recipe properties, emits `removeMeal`, and uses a default slot for the empty-day action. |

This gives the application a clear boundary: Svelte owns routing and state, while the Stencil package provides portable presentation components with property, event, and slot APIs.

### Publish a new library release

Update the version in `packages/recipe-ui/package.json`, build the package, authenticate with npm, and publish:

```bash
npm login
npm run publish:ui
```

After publishing, update the app dependency version in `apps/web/package.json` and reinstall dependencies before deploying a version that uses the new release.

## Testing

The web application includes unit tests for:

- TheMealDB request construction, response normalization, and failure handling.
- Local-store hydration, persistence behavior, favorites, personal recipes, and planner cleanup.
- Personal-recipe validation.

Run the full suite with:

```bash
npm test
```

## Deployment

The application is configured for Vercel through `@sveltejs/adapter-vercel`.

1. Import the repository into Vercel.
2. Set **Root Directory** to `apps/web`.
3. Use `npm run build` as the build command.
4. Deploy with the Node.js 20 runtime.

No application environment variables are needed.

## Assumptions

- TheMealDB supports keyword search, category browsing, cuisine listing, and meal lookup; it does not provide the nutrition or arbitrary compound filtering required for richer search features.
- One recipe can be assigned to each weekday. Assigning another recipe to the same day replaces the previous choice.
- Favorites can contain both TheMealDB recipes and browser-created recipes.
- Browser-created data is intentionally local to the current browser profile.
