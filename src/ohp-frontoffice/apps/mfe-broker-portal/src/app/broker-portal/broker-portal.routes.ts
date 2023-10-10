import { Routes } from '@angular/router';
import { RootLayoutComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import {
  CheckTocCompletedGuard,
  CheckTocNotCompletedGuard,
  FirmIdGuard,
  PortalLoaderGuard,
  PortalUserGuard,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { GlobalLayoutComponent } from '@close-front-office/mfe-broker/shared-ui';
import { MetaResolver } from '@close-front-office/shared/core';

export const BROKER_PORTAL_ROUTES: Routes = [
  {
    path: '',
    resolve: { title: MetaResolver },
    canActivate: [PortalLoaderGuard, PortalUserGuard],
    canDeactivate: [PortalLoaderGuard, PortalUserGuard],
    component: GlobalLayoutComponent,
    children: [
      {
        path: 'complete-registration',
        resolve: { title: MetaResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [CheckTocNotCompletedGuard],
        loadChildren: () =>
          import('@close-front-office/mfe-broker/mfe-broker-portal/pages/complete-registration').then(
            module => module.MfeBrokerMfeBrokerPortalPagesCompleteRegistrationModule,
          ),
      },
      {
        path: 'not-found',
        resolve: { title: MetaResolver },
        runGuardsAndResolvers: 'always',
        loadChildren: () =>
          import('@close-front-office/mfe-broker/mfe-broker-portal/pages/not-found').then(
            module => module.MfeBrokerMfeBrokerPortalPagesNotFoundModule,
          ),
      },
      {
        path: '',
        resolve: { title: MetaResolver },
        canActivate: [CheckTocCompletedGuard],
        runGuardsAndResolvers: 'always',
        children: [
          { path: '', canActivate: [PortalUserGuard], pathMatch: 'full' },
          {
            path: ':firmId',
            component: RootLayoutComponent,
            canActivate: [FirmIdGuard],
            children: [
              { path: '', redirectTo: 'cases', pathMatch: 'full' },
              {
                path: 'cases',
                loadChildren: () =>
                  import('@close-front-office/mfe-broker/mfe-broker-portal/pages/cases-page').then(
                    module => module.MfeBrokerMfeBrokerPortalPagesCasesPageModule,
                  ),
              },
              {
                path: 'products',
                loadChildren: () =>
                  import('@close-front-office/mfe-broker/mfe-broker-portal/pages/products').then(
                    module => module.MfeBrokerMfeBrokerPortalPagesProductsModule,
                  ),
              },
              {
                path: 'profile',
                loadChildren: () =>
                  import('@close-front-office/mfe-broker/mfe-broker-portal/pages/profile').then(
                    module => module.MfeBrokerMfeBrokerPortalPagesProfileModule,
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'not-found' },
];
