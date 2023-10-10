import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full',
  },
  {
    path: 'panel',
    loadChildren: () => import('./broker-panel/broker-panel.module').then(m => m.BrokerPanelModule),
  },
  { path: '**', redirectTo: 'panel/not-found' },
];
