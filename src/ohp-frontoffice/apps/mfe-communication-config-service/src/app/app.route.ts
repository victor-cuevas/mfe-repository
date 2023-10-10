import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'communication',
    pathMatch: 'full'
  },
  {
    path: 'communication',
    loadChildren: () => import('./communication-config-service/communication-config-service.module').then(m => m.CommunicationConfigServiceModule)
  }
];
