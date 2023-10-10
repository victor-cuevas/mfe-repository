import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'process',
    pathMatch: 'full'
  },
  {
    path: 'process',
    loadChildren: () => import('./process-config/process-config.module').then(m => m.ProcessConfigModule)
  }
];
