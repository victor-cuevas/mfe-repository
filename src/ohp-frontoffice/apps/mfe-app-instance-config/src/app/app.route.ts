import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'appinstance',
    pathMatch: 'full'
  },
  {
    path: 'appinstance',
    loadChildren: () => import('./app-instance-config/app-instance-config.module').then(m => m.AppInstanceConfigModule)
  }
];
