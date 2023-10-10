import { Routes } from '@angular/router';
export const RUNNINGACCOUNT_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-runningaccount-config-service/pages').then(m => m.MfeRunningaccountConfigServicePagesModule)
  }
];
