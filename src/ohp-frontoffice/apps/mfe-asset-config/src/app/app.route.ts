import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'asset',
    pathMatch: 'full'
  },
  {
    path: 'asset',
    loadChildren: () => import('./asset-config/asset-config.module').then(m => m.AssetConfigModule)
  }
];
