import { Routes } from '@angular/router';

export const ACCOUNTING_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-accounting-config/pages').then(m => m.MfeAccountingConfigPagesModule)
  }
];
