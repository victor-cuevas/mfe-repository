import { Routes } from '@angular/router';

export const PLAN_CONFIG_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('@close-front-office/mfe-plan-config/pages').then(m => m.MfePlanConfigPagesModule)
  }
];
