import type { Recipe } from '$lib/types';

type Meal = Record<string, string | null>;

function normalize(meal: Meal): Recipe {
  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const item = meal[`strIngredient${i + 1}`]?.trim() ?? '';
    const measure = meal[`strMeasure${i + 1}`]?.trim() ?? '';
    return item ? { item, measure } : null;
  }).filter((ingredient): ingredient is { item: string; measure: string } => Boolean(ingredient));
  return {
    id: meal.idMeal!,
    source: 'api',
    title: meal.strMeal ?? 'Untitled recipe',
    image: meal.strMealThumb ?? '',
    category: meal.strCategory ?? '',
    cuisine: meal.strArea ?? '',
    ingredients,
    instructions: (meal.strInstructions ?? '')
      .split(/\r?\n/)
      .map((step) => step.trim())
      .filter(Boolean),
  };
}

async function get(resource: string, value = ''): Promise<Meal[]> {
  const query = new URLSearchParams({ resource });
  if (value) query.set('value', value);
  const response = await fetch(`/api/meals?${query}`);
  if (!response.ok) throw new Error('The recipe service is unavailable. Please try again.');
  const body = await response.json();
  return body.meals ?? [];
}

export async function searchMeals(query: string): Promise<Recipe[]> {
  return (await get('search', query)).map(normalize);
}
export async function browseCategory(category: string): Promise<Recipe[]> {
  return (await get('category', category)).map(normalize);
}
export async function getMeal(id: string): Promise<Recipe | null> {
  const meals = await get('detail', id);
  return meals[0] ? normalize(meals[0]) : null;
}
export async function getCategories(): Promise<string[]> {
  return (await get('categories')).map((meal) => meal.strCategory!).filter(Boolean);
}
export async function getAreas(): Promise<string[]> {
  return (await get('areas')).map((meal) => meal.strArea!).filter(Boolean);
}
