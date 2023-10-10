import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'taxstatement',
    pathMatch: 'full'
  },
  {
    path: 'taxstatement',
    loadChildren: () => import('./tax-statement-config/tax-statement-config.module').then(m => m.TaxStatementConfigModule)
  }
];
