import { Routes } from '@angular/router';

export const PROCESS_CONFIG_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-process-config/pages').then(m => m.MfeProcessConfigPagesModule)
  }
];
