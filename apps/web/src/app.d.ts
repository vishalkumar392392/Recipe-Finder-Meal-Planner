declare namespace App {}

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onrecipeSelected?: (event: CustomEvent<string>) => void;
    onfavoriteChanged?: (event: CustomEvent<{ id: string; favorite: boolean }>) => void;
    onremoveMeal?: (event: CustomEvent<void>) => void;
  }
}
