<script lang="ts">
  import { goto } from '$app/navigation';
  import RecipeGrid from '$lib/components/RecipeGrid.svelte';
  import { planner } from '$lib/stores/local';
  import type { Recipe } from '$lib/types';
  import { getMeal } from '$lib/api/themealdb';
  import { onMount } from 'svelte';
  let remote: Recipe[] = [];
  let loading = true;
  onMount(async () => {
    const ids = $planner.favorites.filter((id) => !id.startsWith('local-'));
    remote = (await Promise.all(ids.map(getMeal))).filter((recipe): recipe is Recipe =>
      Boolean(recipe),
    );
    loading = false;
  });
  $: recipes = [
    ...$planner.recipes.filter((recipe) => $planner.favorites.includes(recipe.id)),
    ...remote.filter((recipe) => $planner.favorites.includes(recipe.id)),
  ];
</script>

<svelte:head><title>Favorites · Table & Thyme</title></svelte:head>
<h1>Favorite recipes</h1>
<p class="intro">Your personal collection of dishes worth making again.</p>
{#if loading}<p>Loading saved recipes…</p>{:else}<RecipeGrid
    {recipes}
    favorites={$planner.favorites}
    onSelect={(id) => goto(`/recipes/${id}`)}
    onFavorite={(id, favorite) => planner.toggleFavorite(id, favorite)}
  />{/if}

<style>
  h1 {
    font-family: Georgia, serif;
    font-size: 2.6rem;
    margin: 0;
  }
  .intro {
    color: #6e604f;
    margin-bottom: 2rem;
  }
</style>
