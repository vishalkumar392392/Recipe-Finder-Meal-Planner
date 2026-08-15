<script lang="ts">
  import type { Recipe } from '$lib/types';
  export let recipes: Recipe[] = [];
  export let favorites: string[] = [];
  export let onSelect: (id: string) => void;
  export let onFavorite: (id: string, favorite: boolean) => void;
</script>

{#if recipes.length}
  <div class="grid">
    {#each recipes as recipe (recipe.id)}
      <recipe-card
        recipeId={recipe.id}
        recipeTitle={recipe.title}
        image={recipe.image}
        category={recipe.category}
        cuisine={recipe.cuisine}
        favorite={favorites.includes(recipe.id)}
        onrecipeSelected={(event: CustomEvent<string>) => onSelect(event.detail)}
        onfavoriteChanged={(event: CustomEvent<{ id: string; favorite: boolean }>) =>
          onFavorite(event.detail.id, event.detail.favorite)}
      ></recipe-card>
    {/each}
  </div>
{:else}<p class="empty">No recipes found. Try a different search or add your own.</p>{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
  .empty {
    padding: 2rem;
    border: 1px dashed #d9c9b4;
    border-radius: 12px;
    color: #756858;
    text-align: center;
  }
</style>
