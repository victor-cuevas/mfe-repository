import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'authorisation',
    pathMatch: 'full'
  },
  {
    path: 'authorisation',
    loadChildren: () => import('./auth-config/auth-config.module').then(m => m.AuthConfigModule)
  }
];
