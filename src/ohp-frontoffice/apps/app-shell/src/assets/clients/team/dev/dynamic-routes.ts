import { Routes } from '@angular/router';

export const dynamicRoutes: Routes = [
  {
    path: 'landing',
    loadChildren: () => import('@close-front-office/shared/landing').then(m => m.SharedLandingModule),
  },
];
