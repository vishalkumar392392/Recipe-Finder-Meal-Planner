import type { Recipe } from '$lib/types';
export const isFavorite = (ids: string[], id: string) => ids.includes(id);
export function validRecipe(
  recipe: Pick<Recipe, 'title' | 'ingredients' | 'instructions'>,
): string | null {
  if (!recipe.title.trim()) return 'Please add a recipe title.';
  if (!recipe.ingredients.some((ingredient) => ingredient.item.trim()))
    return 'Add at least one ingredient.';
  if (!recipe.instructions.some((step) => step.trim())) return 'Add at least one instruction.';
  return null;
}
