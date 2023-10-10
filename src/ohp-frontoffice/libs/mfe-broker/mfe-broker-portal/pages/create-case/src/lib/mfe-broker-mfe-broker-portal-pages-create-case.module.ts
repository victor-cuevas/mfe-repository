// Angular imports
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Current module imports
import { CreateCasePageComponent } from './create-case-page.component';
import { CreateCaseStepComponent } from './components/create-case-step/create-case-step.component';
import { ApplicantsStepComponent } from './components/applicants-step/applicants-step.component';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { ReviewStepComponent } from './components/review-step/review-step.component';
import { CheckPermissionsGuard } from '@close-front-office/mfe-broker/core';
import { PortalPermissionType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@NgModule({
  imports: [
    CommonModule,
    MfeBrokerMfeBrokerPortalSharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateCasePageComponent,
        resolve: { permissionCheck: CheckPermissionsGuard },
        data: {
          section: 'case',
          features: ['assignee'],
          assistantPermission: PortalPermissionType.View,
        },
        children: [
          { path: '', redirectTo: 'initial-step', pathMatch: 'full' },
          { path: 'initial-step', component: CreateCaseStepComponent },
          { path: 'add-applicant', component: ApplicantsStepComponent },
          { path: 'review', component: ReviewStepComponent },
        ],
      },
    ]),
  ],
  declarations: [CreateCasePageComponent, CreateCaseStepComponent, ApplicantsStepComponent, ReviewStepComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPortalPagesCreateCaseModule {}
