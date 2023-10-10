import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'financial',
    pathMatch: 'full'
  },
  {
    path: 'financial',
    loadChildren: () => import('./financial-config-service/financial-config-service.module').then(m => m.FinancialConfigServiceModule)
  }
];
