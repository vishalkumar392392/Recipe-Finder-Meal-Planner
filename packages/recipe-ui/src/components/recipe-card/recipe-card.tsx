import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({ tag: 'recipe-card', styleUrl: 'recipe-card.css', shadow: true })
export class RecipeCard {
  @Prop() recipeId!: string;
  @Prop() recipeTitle!: string;
  @Prop() image = '';
  @Prop() category = '';
  @Prop() cuisine = '';
  @Prop() favorite = false;
  @Event({ bubbles: true, composed: true }) recipeSelected!: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) favoriteChanged!: EventEmitter<{
    id: string;
    favorite: boolean;
  }>;

  render() {
    return (
      <article>
        <button
          class="image-button"
          onClick={() => this.recipeSelected.emit(this.recipeId)}
          aria-label={`View ${this.recipeTitle}`}
        >
          {this.image ? (
            <img src={this.image} alt="" loading="lazy" />
          ) : (
            <div class="placeholder">No image</div>
          )}
        </button>
        <div class="body">
          <div class="eyebrow">
            {[this.category, this.cuisine].filter(Boolean).join(' · ') || 'Recipe'}
          </div>
          <h3>
            <button class="title" onClick={() => this.recipeSelected.emit(this.recipeId)}>
              {this.recipeTitle}
            </button>
          </h3>
          <div class="actions">
            <slot name="actions" />
            <button
              class="favorite"
              onClick={() =>
                this.favoriteChanged.emit({ id: this.recipeId, favorite: !this.favorite })
              }
              aria-pressed={String(this.favorite)}
            >
              {this.favorite ? '♥ Saved' : '♡ Save'}
            </button>
          </div>
        </div>
      </article>
    );
  }
}
