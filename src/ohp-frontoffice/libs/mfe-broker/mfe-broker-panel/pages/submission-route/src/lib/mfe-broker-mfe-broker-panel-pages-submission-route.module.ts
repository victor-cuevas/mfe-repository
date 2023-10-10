import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CheckPermissionsGuard } from '@close-front-office/mfe-broker/core';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';
import { UpdateSubmissionRouteResolver } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { MfeBrokerMfeBrokerPanelSharedModule } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import { SubmissionRoutePageComponent } from './submission-route-page.component';
import { SubmissionRouteTableComponent } from './components/submission-route-table/submission-route-table.component';
import { UpdateSubmissionRouteComponent } from './pages/update-submission-route/update-submission-route.component';
import { ProcurationFeesFormComponent } from './components/procuration-fees-form/procuration-fees-form.component';
import { DetailsFormComponent } from './components/details-form/details-form.component';

@NgModule({
  declarations: [
    SubmissionRoutePageComponent,
    SubmissionRouteTableComponent,
    UpdateSubmissionRouteComponent,
    ProcurationFeesFormComponent,
    DetailsFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SubmissionRoutePageComponent,
      },
      {
        path: 'new',
        component: UpdateSubmissionRouteComponent,
        resolve: { permissionCheck: CheckPermissionsGuard, fetchedData: UpdateSubmissionRouteResolver },
        data: {
          section: 'submissionRoutes',
          features: ['lender'],
        },
      },
      {
        path: ':id',
        component: UpdateSubmissionRouteComponent,
        resolve: { fetchedData: UpdateSubmissionRouteResolver },
      },
    ]),
    MfeBrokerMfeBrokerPanelSharedModule,
    MfeBrokerSharedUiModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPanelPagesSubmissionRouteModule {}
