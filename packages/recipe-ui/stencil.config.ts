import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'recipeUi',
  srcDir: 'src',
  outputTargets: [
    { type: 'dist' },
    { type: 'dist-custom-elements', customElementsExportBehavior: 'bundle' },
    { type: 'www', serviceWorker: null },
  ],
};
