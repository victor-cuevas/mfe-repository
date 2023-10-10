
import { Routes } from '@angular/router';
export const TAXSTATEMENT_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-tax-statement-config/pages').then(m => m.MfeTaxStatementConfigPagesModule)
  }
];
