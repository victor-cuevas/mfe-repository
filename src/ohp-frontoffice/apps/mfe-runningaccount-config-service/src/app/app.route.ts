import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'runningaccount',
    pathMatch: 'full'
  },
  {
    path: 'runningaccount',
    loadChildren: () => import('./runningaccount-config-service/runningaccount-config-service.module').then(m => m.RunningaccountConfigServiceModule)
  }
];
