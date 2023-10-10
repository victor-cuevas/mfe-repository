// Angular imports
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule } from '@angular/router';

// PrimeNG imports
import { CaseSummaryPageComponent } from './case-summary-page.component';
import { CaseHistoryTableComponent } from './components/case-history-table/case-history-table.component';
import { CaseSummaryComponent } from './components/case-summary/case-summary.component';
import { DipTableComponent } from './components/dip-table/dip-table.component';
import { FullMortgageTableComponent } from './components/full-mortage-table/full-mortgage-table.component';
import { IllustrationsTableComponent } from './components/illustrations-table/illustrations-table.component';
import { CheckPermissionsGuard, PipesModule } from '@close-front-office/mfe-broker/core';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';
import {
  CaseSummaryResolver,
  PROPERTY_AND_LOANS_FEATURE_KEY,
  propertyLoanInit,
  propertyLoanReducer,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { Store, StoreModule } from '@ngrx/store';
import { DocumentsTableComponent } from './components/documents-table/documents-table.component';
import { ApplicantsDialogComponent } from './components/applicants-dialog/applicants-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MfeBrokerMfeBrokerPortalSharedModule,
    RouterModule.forChild([
      {
        path: '',
        resolve: { summary: CaseSummaryResolver },
        runGuardsAndResolvers: (curr: ActivatedRouteSnapshot, future: ActivatedRouteSnapshot) => {
          return future.firstChild?.url.length === 0;
        },
        children: [
          {
            path: '',
            component: CaseSummaryPageComponent,
            pathMatch: 'full',
          },
          {
            path: 'dip',
            resolve: { permissionCheck: CheckPermissionsGuard },
            data: {
              section: 'dip',
              features: ['viewer', 'assignee'],
              assistantPermission: PortalPermissionType.View,
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-portal/pages/create-dip').then(
                module => module.MfeBrokerMfeBrokerPortalPagesCreateDipModule,
              ),
          },
          {
            path: 'illustration',
            resolve: { permissionCheck: CheckPermissionsGuard },
            data: {
              section: 'illustration',
              features: ['viewer', 'assignee'],
              assistantPermission: PortalPermissionType.View,
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-portal/pages/create-illustration').then(
                module => module.MfeBrokerMfeBrokerPortalPagesCreateIllustrationModule,
              ),
          },
          {
            path: 'fma',
            resolve: { permissionCheck: CheckPermissionsGuard },
            data: {
              section: 'fma',
              features: ['viewer', 'assignee'],
              assistantPermission: PortalPermissionType.View,
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-portal/pages/create-fma').then(
                module => module.MfeBrokerMfeBrokerPortalPagesCreateFmaModule,
              ),
          },
        ],
      },
    ]),
    StoreModule.forFeature(PROPERTY_AND_LOANS_FEATURE_KEY, propertyLoanReducer),
    MfeBrokerSharedUiModule,
    PipesModule,
  ],
  declarations: [
    CaseSummaryPageComponent,
    FullMortgageTableComponent,
    DipTableComponent,
    IllustrationsTableComponent,
    CaseHistoryTableComponent,
    CaseSummaryComponent,
    DocumentsTableComponent,
    ApplicantsDialogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPortalPagesCaseSummaryModule {
  constructor(private store: Store) {
    this.store.dispatch(propertyLoanInit());
  }
}
