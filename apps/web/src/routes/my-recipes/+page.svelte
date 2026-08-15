<script lang="ts">
  import { goto } from '$app/navigation';
  import RecipeGrid from '$lib/components/RecipeGrid.svelte';
  import { planner } from '$lib/stores/local';
  function remove(id: string) {
    if (confirm('Delete this recipe? It will also be removed from your favorites and meal plan.'))
      planner.deleteRecipe(id);
  }
</script>

<svelte:head><title>My recipes · Table & Thyme</title></svelte:head>
<div class="heading">
  <div>
    <h1>My recipes</h1>
    <p>Recipes made by you, for your table.</p>
  </div>
  <a href="/my-recipes/new" class="button">Create recipe</a>
</div>
{#if $planner.recipes.length}<div class="grid">
    {#each $planner.recipes as recipe (recipe.id)}<article>
        <img
          src={recipe.image || 'https://placehold.co/640x400/e8dbc9/594a39?text=Your+recipe'}
          alt=""
        />
        <div>
          <p>{recipe.category || 'Your recipe'}</p>
          <h2>{recipe.title}</h2>
          <a class="button secondary" href={`/my-recipes/${recipe.id}`}>Edit</a><button
            class="delete"
            onclick={() => remove(recipe.id)}>Delete</button
          >
        </div>
      </article>{/each}
  </div>{:else}<p class="empty">Nothing here yet. Start with a recipe you love.</p>{/if}

<style>
  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .heading h1,
  h2 {
    font-family: Georgia, serif;
  }
  .heading h1 {
    font-size: 2.6rem;
    margin: 0;
  }
  .heading p {
    color: #6e604f;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1rem;
  }
  article {
    overflow: hidden;
    border: 1px solid #e7ddd0;
    border-radius: 15px;
    background: #fffaf3;
  }
  article img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  article div {
    padding: 1rem;
  }
  article p {
    margin: 0;
    color: #7c6b57;
    font-size: 0.85rem;
    text-transform: uppercase;
  }
  article h2 {
    margin: 0.4rem 0 1rem;
  }
  .delete {
    margin-left: 0.5rem;
    border: 0;
    background: transparent;
    color: #99445a;
    text-decoration: underline;
  }
  .empty {
    padding: 2rem;
    border: 1px dashed #d9c9b4;
    border-radius: 12px;
    color: #756858;
    text-align: center;
  }
</style>
