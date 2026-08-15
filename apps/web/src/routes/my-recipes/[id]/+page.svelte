<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { planner } from '$lib/stores/local';
  import { validRecipe } from '$lib/utils';
  import type { Ingredient, Recipe } from '$lib/types';
  let id = '';
  let title = '';
  let image = '';
  let category = '';
  let cuisine = '';
  let ingredients: Ingredient[] = [{ item: '', measure: '' }];
  let instructions = [''];
  let error = '';
  let editing = false;
  onMount(() => {
    id = $page.params.id ?? '';
    editing = id !== 'new';
    if (editing) {
      const recipe = $planner.recipes.find((item) => item.id === id);
      if (!recipe) {
        goto('/my-recipes');
        return;
      }
      ({ title, image, category, cuisine } = recipe);
      ingredients = recipe.ingredients.length ? recipe.ingredients : [{ item: '', measure: '' }];
      instructions = recipe.instructions.length ? recipe.instructions : [''];
    }
  });
  function save() {
    const recipe: Recipe = {
      id: editing ? id : `local-${crypto.randomUUID()}`,
      source: 'local',
      title: title.trim(),
      image: image.trim(),
      category: category.trim(),
      cuisine: cuisine.trim(),
      ingredients: ingredients.filter((item) => item.item.trim()),
      instructions: instructions.map((item) => item.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    error = validRecipe(recipe) ?? '';
    if (error) return;
    planner.saveRecipe(recipe);
    goto(`/recipes/${recipe.id}`);
  }
  function deleteRecipe() {
    if (confirm('Delete this recipe? It will also be removed from favorites and your meal plan.')) {
      planner.deleteRecipe(id);
      goto('/my-recipes');
    }
  }
</script>

<svelte:head><title>{editing ? 'Edit recipe' : 'Create recipe'} · Table & Thyme</title></svelte:head
>
<h1>{editing ? 'Edit your recipe' : 'Create a recipe'}</h1>
<p class="intro">Keep it simple now; you can always refine it later.</p>
<form
  onsubmit={(event) => {
    event.preventDefault();
    save();
  }}
>
  <label>Recipe title <input bind:value={title} required /></label>
  <div class="two">
    <label>Image URL <input bind:value={image} type="url" placeholder="https://…" /></label><label
      >Category <input bind:value={category} placeholder="Dinner, dessert…" /></label
    ><label>Cuisine <input bind:value={cuisine} placeholder="Italian, Indian…" /></label>
  </div>
  <fieldset>
    <legend>Ingredients</legend>{#each ingredients as ingredient, i}<div class="line">
        <input
          bind:value={ingredient.measure}
          placeholder="Amount"
          aria-label="Ingredient amount"
        /><input
          bind:value={ingredient.item}
          placeholder="Ingredient"
          aria-label="Ingredient"
        /><button
          type="button"
          class="text"
          onclick={() => (ingredients = ingredients.filter((_, index) => index !== i))}
          disabled={ingredients.length === 1}>Remove</button
        >
      </div>{/each}<button
      type="button"
      class="text"
      onclick={() => (ingredients = [...ingredients, { item: '', measure: '' }])}
      >+ Add ingredient</button
    >
  </fieldset>
  <fieldset>
    <legend>Instructions</legend>{#each instructions as instruction, i}<div class="step">
        <textarea
          bind:value={instructions[i]}
          rows="3"
          placeholder={`Step ${i + 1}`}
          aria-label={`Instruction ${i + 1}`}></textarea><button
          type="button"
          class="text"
          onclick={() => (instructions = instructions.filter((_, index) => index !== i))}
          disabled={instructions.length === 1}>Remove</button
        >
      </div>{/each}<button
      type="button"
      class="text"
      onclick={() => (instructions = [...instructions, ''])}>+ Add step</button
    >
  </fieldset>
  {#if error}<p class="error">{error}</p>{/if}
  <div class="actions">
    <button class="button">Save recipe</button><a href="/my-recipes" class="button secondary"
      >Cancel</a
    >{#if editing}<button type="button" class="delete" onclick={deleteRecipe}>Delete recipe</button
      >{/if}
  </div>
</form>

<style>
  h1,
  legend {
    font-family: Georgia, serif;
  }
  h1 {
    font-size: 2.6rem;
    margin: 0;
  }
  .intro {
    color: #6e604f;
    margin-bottom: 2rem;
  }
  form {
    max-width: 760px;
    display: grid;
    gap: 1.4rem;
  }
  label {
    display: grid;
    gap: 0.35rem;
    color: #594a39;
    font-weight: 700;
  }
  input,
  textarea {
    border: 1px solid #cdbda8;
    border-radius: 8px;
    background: #fffaf3;
    padding: 0.7rem;
    color: #30251b;
  }
  .two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .two label:first-child {
    grid-column: span 2;
  }
  fieldset {
    border: 1px solid #d8c9b5;
    border-radius: 12px;
    padding: 1rem;
  }
  legend {
    padding: 0 0.3rem;
    font-size: 1.2rem;
  }
  .line {
    display: grid;
    grid-template-columns: 150px 1fr auto;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
  }
  .step {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
  }
  .text,
  .delete {
    border: 0;
    background: transparent;
    color: #99445a;
    text-decoration: underline;
    padding: 0.3rem;
  }
  .actions {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .error {
    margin: 0;
    color: #8f3029;
    font-weight: 700;
  }
  @media (max-width: 600px) {
    .two {
      grid-template-columns: 1fr;
    }
    .two label:first-child {
      grid-column: auto;
    }
    .line {
      grid-template-columns: 1fr 1fr;
    }
    .line .text {
      grid-column: span 2;
    }
    .step {
      grid-template-columns: 1fr;
    }
  }
</style>
