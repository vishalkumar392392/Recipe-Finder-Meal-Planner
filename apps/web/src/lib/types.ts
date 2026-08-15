export type RecipeSource = 'api' | 'local';
export type Ingredient = { item: string; measure?: string };
export type Recipe = {
  id: string;
  source: RecipeSource;
  title: string;
  image: string;
  category: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  createdAt?: string;
};
export type MealPlan = Record<string, string | null>;
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const emptyPlan = (): MealPlan => Object.fromEntries(days.map((day) => [day, null]));
