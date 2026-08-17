import { newSpecPage } from '@stencil/core/testing';
import { PlannerDay } from './planner-day';

describe('planner-day', () => {
  it('renders an assigned meal and emits an event when it is removed', async () => {
    const page = await newSpecPage({
      components: [PlannerDay],
      html: `<planner-day
        day="Monday"
        recipe-title="Lentil curry"
        recipe-image="https://example.test/lentil-curry.jpg"
      ></planner-day>`,
    });
    const removals: CustomEvent<void>[] = [];
    page.root!.addEventListener('removeMeal', (event) => removals.push(event as CustomEvent<void>));

    const shadow = page.root!.shadowRoot!;

    expect(shadow.querySelector('h3')!.textContent).toBe('Monday');
    expect(shadow.querySelector('strong')!.textContent).toBe('Lentil curry');
    expect(shadow.querySelector('img')!.getAttribute('src')).toBe(
      'https://example.test/lentil-curry.jpg',
    );
    expect(shadow.querySelector('button')!.getAttribute('aria-label')).toBe(
      'Remove Lentil curry from Monday',
    );

    (shadow.querySelector('button') as HTMLButtonElement).click();
    expect(removals).toHaveLength(1);
  });

  it('renders the empty state and preserves its default slot', async () => {
    const page = await newSpecPage({
      components: [PlannerDay],
      html: '<planner-day day="Tuesday"><a href="/">Choose a recipe</a></planner-day>',
    });

    const shadow = page.root!.shadowRoot!;

    expect(shadow.querySelector('.empty')).not.toBeNull();
    expect(shadow.querySelector('slot')!.textContent).toBe('No recipe planned');
    expect(page.root!.querySelector('a')!.textContent).toBe('Choose a recipe');
  });

  it('does not render an image when an assigned meal has no image URL', async () => {
    const page = await newSpecPage({
      components: [PlannerDay],
      html: '<planner-day day="Wednesday" recipe-title="Lentil curry"></planner-day>',
    });

    expect(page.root!.shadowRoot!.querySelector('img')).toBeNull();
  });
});
