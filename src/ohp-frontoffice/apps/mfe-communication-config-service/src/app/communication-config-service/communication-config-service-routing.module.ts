import { Routes } from '@angular/router';

export const COMMUNICATION_CONFIG_SERVICE_ROUTES: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@close-front-office/mfe-communication-config-service/pages').then(m => m.MfeCommunicationConfigServicePagesModule)
  }
];
