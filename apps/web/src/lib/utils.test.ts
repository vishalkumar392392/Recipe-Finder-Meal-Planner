import { describe, expect, it } from 'vitest';
import { isFavorite, validRecipe } from './utils';

describe('isFavorite', () => {
  it('returns true only when the recipe id is saved', () => {
    expect(isFavorite(['recipe-1', 'recipe-2'], 'recipe-2')).toBe(true);
    expect(isFavorite(['recipe-1', 'recipe-2'], 'recipe-3')).toBe(false);
  });
});

describe('validRecipe', () => {
  const validRecipeInput = {
    title: 'Vegetable curry',
    ingredients: [{ item: 'Chickpeas' }],
    instructions: ['Simmer for 20 minutes.'],
  };

  it('requires a non-blank title', () => {
    expect(validRecipe({ ...validRecipeInput, title: '  ' })).toBe(
      'Please add a recipe title.',
    );
  });

  it('requires an ingredient and an instruction with content', () => {
    expect(
      validRecipe({ ...validRecipeInput, ingredients: [{ item: '  ' }] }),
    ).toBe('Add at least one ingredient.');
    expect(validRecipe({ ...validRecipeInput, instructions: ['  '] })).toBe(
      'Add at least one instruction.',
    );
  });

  it('accepts a complete recipe', () => {
    expect(validRecipe(validRecipeInput)).toBeNull();
  });
});
