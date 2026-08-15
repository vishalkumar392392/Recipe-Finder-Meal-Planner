Assignment: Recipe Finder & Meal Planner

Build a modern Recipe Finder & Meal Planner platform using Svelte 5, SvelteKit, and StencilJS.

The application should enable users to discover recipes from a public recipe API, view detailed recipe information, maintain a list of favorite recipes, and organize recipes into a weekly meal plan.

In addition to the application, you are required to design and develop a reusable StencilJS component library, publish it as an npm package, and consume the published package within your SvelteKit application.

The solution should demonstrate your understanding of component-based development, state management, routing, API integration, web components, and frontend architecture. You are encouraged to make design and implementation decisions independently and explore documentation beyond the training material.

Functional Requirements

Recipe Discovery:

- Search for recipes.
- Browse recipes.
- Filter recipes.
- Display recipes in an organized manner.

Recipe Details:

- View complete recipe details including ingredients and instructions through a dedicated recipe details page.

Recipe Management:

- Add recipes.
- Edit recipes created by the user.
- Delete recipes created by the user.
- Validate recipe input before saving.

Favorites:

- Add recipes to favorites.
- Remove recipes from favorites.
- View all favorite recipes.

Weekly Meal Planner:

- Create a weekly meal plan.
- Assign recipes to days of the week.
- Modify or remove planned meals.

npm Publishing Requirement

- Package the StencilJS component library as a reusable library.
- Publish the library to npm under an appropriate package name or scope.
- Follow versioning best practices.
- Consume the published npm package within the SvelteKit application instead of importing components directly from source.

Integration Requirement

- Pass data from SvelteKit to Stencil components using component properties.
- Handle custom events emitted by Stencil components within the SvelteKit application.
- Use slots where applicable.
- Use the Stencil components as part of the main application experience.

Deliverables

- Source code for the SvelteKit application.
- Source code for the StencilJS component library.
- npm package link for the published component library.
- Deployed application URL.
- README containing:
  - Setup instructions.
  - Assumptions made.
  - Starting development server.
  - Link to Stencil library published on npm.
  - Link to GitHub repository.
