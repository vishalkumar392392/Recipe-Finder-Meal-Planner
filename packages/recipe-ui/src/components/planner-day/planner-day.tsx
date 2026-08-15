import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({ tag: 'planner-day', styleUrl: 'planner-day.css', shadow: true })
export class PlannerDay {
  @Prop() day!: string;
  @Prop() recipeTitle = '';
  @Prop() recipeImage = '';
  @Event({ bubbles: true, composed: true }) removeMeal!: EventEmitter<void>;
  render() {
    return (
      <section>
        <h3>{this.day}</h3>
        {this.recipeTitle ? (
          <div class="meal">
            {this.recipeImage && <img src={this.recipeImage} alt="" />}
            <strong>{this.recipeTitle}</strong>
            <button
              onClick={() => this.removeMeal.emit()}
              aria-label={`Remove ${this.recipeTitle} from ${this.day}`}
            >
              Remove
            </button>
          </div>
        ) : (
          <div class="empty">
            <slot>No recipe planned</slot>
          </div>
        )}
      </section>
    );
  }
}
