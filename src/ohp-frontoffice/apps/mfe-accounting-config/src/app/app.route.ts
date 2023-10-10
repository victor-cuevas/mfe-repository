import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'accounting',
    pathMatch: 'full'
  },
  {
    path: 'accounting',
    loadChildren: () => import('./accounting-config/accounting-config.module').then(m => m.AccountingConfigModule)
  }
];
