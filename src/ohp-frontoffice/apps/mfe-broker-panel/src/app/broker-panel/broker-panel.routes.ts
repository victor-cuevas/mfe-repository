import { Routes } from '@angular/router';

import { RootLayoutComponent } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import {
  CheckTocCompletedGuard,
  PanelLoaderGuard,
  PanelUserGuard,
  ReadOnlyModeResolver,
} from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { GlobalLayoutComponent } from '@close-front-office/mfe-broker/shared-ui';
import { CheckPermissionsGuard } from '@close-front-office/mfe-broker/core';
import { MetaResolver } from '@close-front-office/shared/core';

export const BROKER_PANEL_ROUTES: Routes = [
  {
    path: '',
    resolve: { title: MetaResolver },
    canActivate: [PanelLoaderGuard, PanelUserGuard],
    canActivateChild: [PanelUserGuard],
    canDeactivate: [PanelLoaderGuard, PanelUserGuard],
    component: GlobalLayoutComponent,
    children: [
      {
        path: 'not-found',
        resolve: { title: MetaResolver },
        runGuardsAndResolvers: 'always',
        loadChildren: () =>
          import('@close-front-office/mfe-broker/mfe-broker-panel/pages/not-found').then(
            module => module.MfeBrokerMfeBrokerPanelPagesNotFoundModule,
          ),
      },
      {
        path: '',
        resolve: { title: MetaResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [CheckTocCompletedGuard],
        component: RootLayoutComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            resolve: { permissionCheck: CheckPermissionsGuard },
            data: {
              section: 'switcher',
              features: ['lender'],
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-panel/pages/dashboard').then(
                module => module.MfeBrokerMfeBrokerPanelPagesDashboardModule,
              ),
          },
          {
            path: 'firms',
            resolve: { readOnlyMode: ReadOnlyModeResolver },
            data: {
              section: 'firms',
              lenderFeatures: ['viewer'],
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-panel/pages/firms').then(
                module => module.MfeBrokerMfeBrokerPanelPagesFirmsModule,
              ),
          },
          {
            path: 'submission-routes',
            resolve: { permissionCheck: CheckPermissionsGuard, readOnlyMode: ReadOnlyModeResolver },
            data: {
              section: 'submissionRoutes',
              features: ['viewer', 'lender'],
              lenderFeatures: ['viewer'],
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-panel/pages/submission-route').then(
                module => module.MfeBrokerMfeBrokerPanelPagesSubmissionRouteModule,
              ),
          },
          {
            path: 'configuration',
            resolve: { permissionCheck: CheckPermissionsGuard, readOnlyMode: ReadOnlyModeResolver },
            data: {
              section: 'configuration',
              features: ['viewer', 'lender'],
              lenderFeatures: ['viewer'],
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-panel/pages/configuration').then(
                module => module.MfeBrokerMfeBrokerPanelPagesConfigurationModule,
              ),
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-panel/pages/profile').then(
                module => module.MfeBrokerMfeBrokerPanelPagesProfileModule,
              ),
          },
          {
            path: 'lender',
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-panel/pages/lender-page').then(
                module => module.MfeBrokerMfeBrokerPanelPagesLenderPageModule,
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'not-found' },
];
