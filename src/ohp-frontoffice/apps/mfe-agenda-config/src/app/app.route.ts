import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'agenda',
    pathMatch: 'full'
  },
  {
    path: 'agenda',
    loadChildren: () => import('./agenda-config/agenda-config.module').then(m => m.AgendaConfigModule)
  }
];
