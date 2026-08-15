import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { emptyPlan, type MealPlan, type Recipe } from '$lib/types';

const KEY = 'recipe-planner:v1';
type Saved = { recipes: Recipe[]; favorites: string[]; plan: MealPlan };
const initial: Saved = { recipes: [], favorites: [], plan: emptyPlan() };
function read(): Saved {
  if (!browser) return initial;
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return {
      recipes: Array.isArray(value?.recipes) ? value.recipes : [],
      favorites: Array.isArray(value?.favorites) ? value.favorites : [],
      plan: { ...emptyPlan(), ...(value?.plan ?? {}) },
    };
  } catch {
    return initial;
  }
}
function createStore() {
  const { subscribe, set, update } = writable<Saved>(browser ? read() : initial);
  return {
    subscribe,
    hydrate: () => set(read()),
    saveRecipe: (recipe: Recipe) =>
      update((data) => {
        const recipes = data.recipes.some((item) => item.id === recipe.id)
          ? data.recipes.map((item) => (item.id === recipe.id ? recipe : item))
          : [recipe, ...data.recipes];
        return { ...data, recipes };
      }),
    deleteRecipe: (id: string) =>
      update((data) => ({
        recipes: data.recipes.filter((recipe) => recipe.id !== id),
        favorites: data.favorites.filter((favorite) => favorite !== id),
        plan: Object.fromEntries(
          Object.entries(data.plan).map(([day, recipeId]) => [
            day,
            recipeId === id ? null : recipeId,
          ]),
        ),
      })),
    toggleFavorite: (id: string, force?: boolean) =>
      update((data) => {
        const favorite = force ?? !data.favorites.includes(id);
        return {
          ...data,
          favorites: favorite
            ? [...new Set([...data.favorites, id])]
            : data.favorites.filter((value) => value !== id),
        };
      }),
    assign: (day: string, id: string | null) =>
      update((data) => ({ ...data, plan: { ...data.plan, [day]: id } })),
  };
}
export const planner = createStore();
if (browser) planner.subscribe((data) => localStorage.setItem(KEY, JSON.stringify(data)));
