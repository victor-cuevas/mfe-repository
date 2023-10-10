import { Routes } from '@angular/router';

export const APPINSTANCE_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-app-instance-config/pages').then(m => m.MfeAppInstanceConfigPagesModule)
  }
];
