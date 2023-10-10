import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'collection-measure',
    pathMatch: 'full'
  },
  {
    path: 'collection-measure',
    loadChildren: () => import('./collection-measure-config/collection-measure-config.module').then(m => m.CollectionMeasureConfigModule)
  }
];
