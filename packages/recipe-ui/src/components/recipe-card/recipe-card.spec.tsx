import { newSpecPage } from '@stencil/core/testing';
import { RecipeCard } from './recipe-card';

describe('recipe-card', () => {
  it('renders the supplied recipe information and saved state', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: `<recipe-card
        recipe-id="meal-42"
        recipe-title="Lentil curry"
        image="https://example.test/lentil-curry.jpg"
        category="Vegetarian"
        cuisine="Indian"
        favorite
      ></recipe-card>`,
    });

    const shadow = page.root!.shadowRoot!;

    expect(shadow.querySelector('.eyebrow')!.textContent).toBe('Vegetarian · Indian');
    expect(shadow.querySelector('.title')!.textContent).toBe('Lentil curry');
    expect(shadow.querySelector('img')!.getAttribute('src')).toBe(
      'https://example.test/lentil-curry.jpg',
    );
    expect(shadow.querySelector('.favorite')!.textContent).toBe('♥ Saved');
    expect(shadow.querySelector('.favorite')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('uses fallback content when optional recipe metadata is absent', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: '<recipe-card recipe-id="meal-42" recipe-title="Lentil curry"></recipe-card>',
    });

    const shadow = page.root!.shadowRoot!;

    expect(shadow.querySelector('.placeholder')!.textContent).toBe('No image');
    expect(shadow.querySelector('.eyebrow')!.textContent).toBe('Recipe');
    expect(shadow.querySelector('.favorite')!.textContent).toBe('♡ Save');
  });

  it('emits recipe selection and favorite-change events from its controls', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: '<recipe-card recipe-id="meal-42" recipe-title="Lentil curry"></recipe-card>',
    });
    const selected: CustomEvent<string>[] = [];
    const favoriteChanges: CustomEvent<{ id: string; favorite: boolean }>[] = [];
    page.root!.addEventListener('recipeSelected', (event) =>
      selected.push(event as CustomEvent<string>),
    );
    page.root!.addEventListener('favoriteChanged', (event) =>
      favoriteChanges.push(event as CustomEvent<{ id: string; favorite: boolean }>),
    );

    const shadow = page.root!.shadowRoot!;
    (shadow.querySelector('.image-button') as HTMLButtonElement).click();
    (shadow.querySelector('.title') as HTMLButtonElement).click();
    (shadow.querySelector('.favorite') as HTMLButtonElement).click();

    expect(selected.map((event) => event.detail)).toEqual(['meal-42', 'meal-42']);
    expect(favoriteChanges.map((event) => event.detail)).toEqual([
      { id: 'meal-42', favorite: true },
    ]);
  });
});
