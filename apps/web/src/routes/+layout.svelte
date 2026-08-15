<script lang="ts">
  import { onMount } from 'svelte';
  import { defineCustomElements } from '@vishalkumar392/recipe-ui/components';
  import { planner } from '$lib/stores/local';
  import '../app.css';
  onMount(() => {
    defineCustomElements();
    planner.hydrate();
  });
</script>

<svelte:head><title>Table & Thyme</title></svelte:head>
<header>
  <a class="brand" href="/">Table <em>&</em> Thyme</a>
  <nav aria-label="Main navigation">
    <a href="/">Discover</a><a href="/favorites">Favorites</a><a href="/planner">Planner</a><a
      href="/my-recipes">My recipes</a
    >
  </nav>
</header>
<main><slot /></main>
<footer>Made for unhurried, delicious weeks.</footer>
