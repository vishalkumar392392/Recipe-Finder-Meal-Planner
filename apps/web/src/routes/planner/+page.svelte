<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getMeal } from '$lib/api/themealdb';
  import { planner } from '$lib/stores/local';
  import { days, type Recipe } from '$lib/types';
  let remote = new Map<string, Recipe>();
  let loading = true;
  onMount(async () => {
    const remoteIds = Object.values($planner.plan).filter(
      (id): id is string => typeof id === 'string' && !id.startsWith('local-'),
    );
    const meals = await Promise.all(remoteIds.map(getMeal));
    meals.forEach((meal) => {
      if (meal) remote.set(meal.id, meal);
    });
    remote = new Map(remote);
    loading = false;
  });
  $: known = new Map<string, Recipe>([
    ...$planner.recipes.map((recipe): [string, Recipe] => [recipe.id, recipe]),
    ...remote,
  ]);
  $: plannedRecipes = Object.fromEntries(
    days.map((day) => [day, known.get($planner.plan[day] ?? '')]),
  ) as Record<string, Recipe | undefined>;
  $: suggestions = [...$planner.recipes, ...remote.values()];
</script>

<svelte:head><title>Weekly planner · Table & Thyme</title></svelte:head>
<h1>Plan your week</h1>
<p class="intro">A gentle outline for seven satisfying days.</p>
{#if loading}<p>Loading your planned meals…</p>{:else}<div class="week">
    {#each days as day}<planner-day
        {day}
        recipeTitle={plannedRecipes[day]?.title ?? ''}
        recipeImage={plannedRecipes[day]?.image ?? ''}
        onremoveMeal={() => planner.assign(day, null)}><a href="/">Choose a recipe</a></planner-day
      >{/each}
  </div>{/if}
<section class="add">
  <h2>Assign a recipe</h2>
  {#if suggestions.length}<div class="choices">
      {#each suggestions as recipe}<button
          onclick={() => {
            const day = prompt(`Plan ${recipe.title} for which day?`, 'Monday');
            if (day && days.includes(day)) planner.assign(day, recipe.id);
          }}>{recipe.title}</button
        >{/each}
    </div>{:else}<p>Save or create a recipe first, then it will be available here.</p>{/if}<a
    href="/"
    class="button">Find recipes</a
  >
</section>

<style>
  h1,
  h2 {
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
  .week {
    display: grid;
    grid-template-columns: repeat(7, minmax(150px, 1fr));
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  .add {
    margin-top: 3rem;
    padding: 1.5rem;
    border-radius: 16px;
    background: #e9dece;
  }
  .choices {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .choices button {
    border: 1px solid #cab8a0;
    border-radius: 99px;
    background: #fffaf3;
    padding: 0.45rem 0.7rem;
    color: #493b2c;
  }
  @media (max-width: 700px) {
    .week {
      grid-template-columns: repeat(7, 180px);
    }
  }
</style>
