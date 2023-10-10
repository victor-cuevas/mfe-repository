// Angular imports
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';

// Shared imports
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';

// Current module imports
import { CasesPageComponent } from './cases-page.component';
import { CaseTableComponent } from './components/case-table/case-table.component';
import { CheckPermissionsGuard, PipesModule } from '@close-front-office/mfe-broker/core';
import { PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@NgModule({
  imports: [
    CommonModule,
    CheckboxModule,
    MultiSelectModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: '', component: CasesPageComponent, pathMatch: 'full' },
          {
            path: 'new',
            resolve: { permissionCheck: CheckPermissionsGuard },
            data: {
              section: 'case',
              features: ['assignee'],
              assistantPermission: PortalPermissionType.Illustration,
            },
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-portal/pages/create-case').then(
                module => module.MfeBrokerMfeBrokerPortalPagesCreateCaseModule,
              ),
          },
          {
            path: ':caseId',
            loadChildren: () =>
              import('@close-front-office/mfe-broker/mfe-broker-portal/pages/case-summary').then(
                module => module.MfeBrokerMfeBrokerPortalPagesCaseSummaryModule,
              ),
          },
        ],
      },
    ]),
    MfeBrokerMfeBrokerPortalSharedModule,
    PipesModule,
  ],
  declarations: [CasesPageComponent, CaseTableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPortalPagesCasesPageModule {}
