import { Routes } from '@angular/router';

export const ASSET_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-asset-config/pages').then(m => m.MfeAssetConfigPagesModule)
  }
];
