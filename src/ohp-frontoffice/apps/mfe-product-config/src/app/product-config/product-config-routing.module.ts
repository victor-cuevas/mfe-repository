import { Routes } from '@angular/router';
export const PRODUCT_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-product-config/pages').then(m => m.MfeProductConfigPagesModule)
  }
];
