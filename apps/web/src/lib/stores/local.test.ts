import { afterEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import type { Recipe } from '$lib/types';

const recipe: Recipe = {
  id: 'recipe-1',
  source: 'local',
  title: 'Lentil soup',
  image: '',
  category: 'Soup',
  cuisine: 'Indian',
  ingredients: [{ item: 'Lentils' }],
  instructions: ['Cook the lentils.'],
};

async function loadPlanner(browser: boolean) {
  vi.resetModules();
  vi.doMock('$app/environment', () => ({ browser }));
  return import('./local');
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.doUnmock('$app/environment');
  vi.resetModules();
});

describe('planner store', () => {
  it('manages recipes, favourites, and meal assignments during SSR', async () => {
    const { planner } = await loadPlanner(false);
    const updatedRecipe = { ...recipe, title: 'Creamy lentil soup' };

    planner.hydrate();
    planner.saveRecipe(recipe);
    planner.saveRecipe(updatedRecipe);
    planner.toggleFavorite(recipe.id);
    planner.toggleFavorite(recipe.id, true);
    planner.assign('Monday', recipe.id);
    planner.deleteRecipe(recipe.id);

    expect(get(planner)).toMatchObject({
      recipes: [],
      favorites: [],
      plan: { Monday: null },
    });
  });

  it('hydrates browser state from local storage and persists changes', async () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(
        JSON.stringify({ recipes: [recipe], favorites: 'invalid', plan: { Monday: recipe.id } }),
      ),
      setItem: vi.fn(),
    };
    vi.stubGlobal('localStorage', storage);
    const { planner } = await loadPlanner(true);

    expect(get(planner)).toMatchObject({
      recipes: [recipe],
      favorites: [],
      plan: { Monday: recipe.id, Tuesday: null },
    });
    expect(storage.setItem).toHaveBeenCalled();

    planner.toggleFavorite(recipe.id, false);
    expect(get(planner).favorites).toEqual([]);
  });

  it('recovers from unreadable browser storage', async () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => {
        throw new Error('storage blocked');
      }),
      setItem: vi.fn(),
    });
    const { planner } = await loadPlanner(true);

    expect(get(planner)).toMatchObject({ recipes: [], favorites: [] });
  });
});
