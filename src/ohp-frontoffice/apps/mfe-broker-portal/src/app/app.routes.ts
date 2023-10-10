import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'broker',
    pathMatch: 'full',
  },
  {
    path: 'broker',
    loadChildren: () => import('./broker-portal/broker-portal.module').then(m => m.BrokerPortalModule),
  },
  { path: '**', redirectTo: 'broker/not-found' },
];
