import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'plan',
    pathMatch: 'full'
  },
  {
    path: 'plan',
    loadChildren: () => import('./plan-config/plan-config.module').then(m => m.PlanConfigModule)
  }
];
