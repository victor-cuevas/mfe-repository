import { Routes } from '@angular/router';
export const COLLECTIONMEASURE_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-collection-measure-config/pages').then(m => m.MfeCollectionMeasureConfigPagesModule)
  }
];
