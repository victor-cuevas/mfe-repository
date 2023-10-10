import { Routes } from '@angular/router';

export const AUTH_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-auth-config/pages').then(m => m.MfeAuthConfigPagesModule)
  }
];
