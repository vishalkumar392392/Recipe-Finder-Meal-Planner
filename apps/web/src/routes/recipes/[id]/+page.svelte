<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getMeal } from '$lib/api/themealdb';
  import { planner } from '$lib/stores/local';
  import type { Recipe } from '$lib/types';
  let recipe: Recipe | null = null;
  let error = '';
  let selectedDay = 'Monday';
  onMount(async () => {
    const id = $page.params.id ?? '';
    recipe = id.startsWith('local-')
      ? ($planner.recipes.find((item) => item.id === id) ?? null)
      : await getMeal(id);
    if (!recipe) error = 'We could not find that recipe.';
  });
</script>

<svelte:head
  ><title>{recipe ? `${recipe.title} · Table & Thyme` : 'Recipe · Table & Thyme'}</title
  ></svelte:head
>
{#if error}<h1>Recipe unavailable</h1>
  <p>{error}</p>
  <a href="/" class="button">Back to discovery</a>{:else if !recipe}<p>Loading recipe…</p>{:else}
  <a class="back" href="/">← Discover recipes</a>
  <section class="lead">
    <img src={recipe.image} alt="" />
    <div>
      <p class="kicker">{recipe.category} · {recipe.cuisine}</p>
      <h1>{recipe.title}</h1>
      <div class="controls">
        <button class="button" onclick={() => planner.toggleFavorite(recipe!.id)}
          >{$planner.favorites.includes(recipe.id) ? '♥ Saved' : '♡ Save recipe'}</button
        ><select bind:value={selectedDay} aria-label="Day to plan"
          >{#each ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as day}<option
              >{day}</option
            >{/each}</select
        ><button class="button secondary" onclick={() => planner.assign(selectedDay, recipe!.id)}
          >Plan it</button
        >{#if recipe.source === 'local'}<a
            class="button secondary"
            href={`/my-recipes/${recipe.id}`}>Edit</a
          >{/if}
      </div>
    </div>
  </section>
  <section class="details">
    <div>
      <h2>Ingredients</h2>
      <ul>
        {#each recipe.ingredients as ingredient}<li>
            {ingredient.measure}
            {ingredient.item}
          </li>{/each}
      </ul>
    </div>
    <div>
      <h2>Instructions</h2>
      <ol>
        {#each recipe.instructions as instruction}<li>{instruction}</li>{/each}
      </ol>
    </div>
  </section>
{/if}

<style>
  .back {
    color: #755840;
    text-decoration: none;
  }
  .lead {
    display: grid;
    grid-template-columns: minmax(260px, 0.9fr) 1.1fr;
    gap: 2.5rem;
    margin: 1.5rem 0 3rem;
    align-items: center;
  }
  .lead img {
    width: 100%;
    border-radius: 18px;
  }
  .kicker {
    color: #a84943;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .lead h1,
  h2 {
    font-family: Georgia, serif;
  }
  .lead h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    line-height: 1.06;
    margin: 0.4rem 0 1.5rem;
  }
  .controls {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .controls select {
    border: 1px solid #cdbda8;
    border-radius: 9px;
    background: #fffaf3;
    padding: 0.7rem;
  }
  .details {
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 3rem;
    line-height: 1.65;
  }
  .details li {
    margin-bottom: 0.6rem;
  }
  @media (max-width: 700px) {
    .lead,
    .details {
      grid-template-columns: 1fr;
    }
  }
</style>
