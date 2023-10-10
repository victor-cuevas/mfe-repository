import { Routes } from '@angular/router';

export const FINANCIAL_CONFIG_SERVICE_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-financial-config-service/pages').then(m => m.MfeFinancialConfigServicePagesModule)
  }
];
