import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  browseCategory,
  getAreas,
  getCategories,
  getMeal,
  searchMeals,
} from './themealdb';

const meal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strMealThumb: 'https://example.test/chicken.jpg',
  strCategory: 'Chicken',
  strArea: 'Japanese',
  strIngredient1: 'Chicken',
  strMeasure1: '2 cups',
  strIngredient2: ' ',
  strMeasure2: 'unused',
  strIngredient3: 'Rice',
  strMeasure3: null,
  strInstructions: 'Cook chicken.\n\nServe with rice. ',
};

function mockFetch(body: unknown, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    json: vi.fn().mockResolvedValue(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe('TheMealDB client', () => {
  it('searches with an encoded query and normalizes a returned meal', async () => {
    const fetchMock = mockFetch({ meals: [meal] });

    await expect(searchMeals('chicken & rice')).resolves.toEqual([
      {
        id: '52772',
        source: 'api',
        title: 'Teriyaki Chicken Casserole',
        image: 'https://example.test/chicken.jpg',
        category: 'Chicken',
        cuisine: 'Japanese',
        ingredients: [
          { item: 'Chicken', measure: '2 cups' },
          { item: 'Rice', measure: '' },
        ],
        instructions: ['Cook chicken.', 'Serve with rice.'],
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/meals?resource=search&value=chicken+%26+rice',
    );
  });

  it('returns null when a requested meal is not found', async () => {
    mockFetch({ meals: null });

    await expect(getMeal('missing')).resolves.toBeNull();
  });

  it('filters missing categories and surfaces service failures', async () => {
    mockFetch({ meals: [{ strCategory: 'Breakfast' }, { strCategory: '' }] });
    await expect(getCategories()).resolves.toEqual(['Breakfast']);

    mockFetch({}, false);
    await expect(searchMeals('pasta')).rejects.toThrow(
      'The recipe service is unavailable. Please try again.',
    );
  });

  it('browses categories and returns the available areas', async () => {
    const fetchMock = mockFetch({ meals: [meal] });
    await expect(browseCategory('Chicken')).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/meals?resource=category&value=Chicken');

    mockFetch({ meals: [{ strArea: 'Italian' }, { strArea: null }] });
    await expect(getAreas()).resolves.toEqual(['Italian']);
  });

  it('uses safe defaults when optional meal fields are absent', async () => {
    mockFetch({ meals: [{ idMeal: '1' }] });

    await expect(searchMeals('unknown')).resolves.toEqual([
      {
        id: '1',
        source: 'api',
        title: 'Untitled recipe',
        image: '',
        category: '',
        cuisine: '',
        ingredients: [],
        instructions: [],
      },
    ]);
  });
});
