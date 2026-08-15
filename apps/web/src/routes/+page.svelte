<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browseCategory, getAreas, getCategories, searchMeals } from '$lib/api/themealdb';
  import RecipeGrid from '$lib/components/RecipeGrid.svelte';
  import { planner } from '$lib/stores/local';
  import type { Recipe } from '$lib/types';
  let query = '';
  let category = '';
  let area = '';
  let categories: string[] = [];
  let areas: string[] = [];
  let recipes: Recipe[] = [];
  let loading = true;
  let error = '';
  async function load() {
    loading = true;
    error = '';
    try {
      recipes = query.trim()
        ? await searchMeals(query.trim())
        : category
          ? await browseCategory(category)
          : await searchMeals('');
      if (area) recipes = recipes.filter((recipe) => recipe.cuisine === area);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unable to load recipes.';
    } finally {
      loading = false;
    }
  }
  function select(id: string) {
    goto(`/recipes/${id}`);
  }
  onMount(async () => {
    [categories, areas] = await Promise.all([getCategories(), getAreas()]);
    await load();
  });
</script>

<svelte:head><title>Discover recipes · Table & Thyme</title></svelte:head>
<section class="hero">
  <p class="kicker">Your next favorite meal</p>
  <h1>Find something wonderful to cook.</h1>
  <p>Search recipes, save the keepers, and give every day of the week a little more flavor.</p>
  <form
    onsubmit={(event) => {
      event.preventDefault();
      load();
    }}
  >
    <input
      bind:value={query}
      placeholder="Search pasta, chicken, soup…"
      aria-label="Search recipes"
    /><button class="button">Search</button>
  </form>
</section>
<section class="toolbar">
  <div>
    <label
      >Category <select bind:value={category} onchange={load}
        ><option value="">All categories</option>{#each categories as item}<option>{item}</option
          >{/each}</select
      ></label
    ><label
      >Cuisine <select bind:value={area} onchange={load}
        ><option value="">All cuisines</option>{#each areas as item}<option>{item}</option
          >{/each}</select
      ></label
    >
  </div>
  <a href="/my-recipes/new" class="button secondary">Create recipe</a>
</section>
{#if error}<p class="notice error">{error}</p>{:else if loading}<p class="notice">
    Gathering recipes…
  </p>{:else}<RecipeGrid
    {recipes}
    favorites={$planner.favorites}
    onSelect={select}
    onFavorite={(id, favorite) => planner.toggleFavorite(id, favorite)}
  />{/if}

<style>
  .hero {
    max-width: 720px;
    padding: 3rem 0 2.2rem;
  }
  .kicker {
    margin: 0;
    color: #a84943;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .hero h1 {
    max-width: 620px;
    margin: 0.35rem 0;
    font-family: Georgia, serif;
    font-size: clamp(2.5rem, 7vw, 4.5rem);
    line-height: 1.04;
  }
  .hero > p:not(.kicker) {
    color: #6e604f;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  .hero form {
    display: flex;
    gap: 0.6rem;
    margin-top: 1.5rem;
  }
  .hero input {
    flex: 1;
    min-width: 0;
    border: 1px solid #cdbda8;
    border-radius: 9px;
    padding: 0.72rem;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    margin: 1rem 0 1.5rem;
  }
  .toolbar div {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .toolbar label {
    display: grid;
    gap: 0.25rem;
    color: #655745;
    font-size: 0.82rem;
    font-weight: 700;
  }
  .toolbar select {
    border: 1px solid #cdbda8;
    border-radius: 7px;
    background: #fffaf3;
    padding: 0.42rem;
  }
  .notice {
    padding: 1rem;
    border-radius: 9px;
    background: #eee3d4;
    color: #695b4a;
  }
  .error {
    background: #f4d9d5;
    color: #7b322a;
  }
  @media (max-width: 600px) {
    .hero form,
    .toolbar {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>
