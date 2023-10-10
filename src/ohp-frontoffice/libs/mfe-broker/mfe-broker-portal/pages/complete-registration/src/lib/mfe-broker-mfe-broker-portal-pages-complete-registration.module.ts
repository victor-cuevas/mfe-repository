import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalUserResolver } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

// Shared imports
import { CompleteRegistrationPageComponent } from './complete-registration-page.component';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { CompleteRegistrationFormComponent } from './components/complete-registration-form/complete-registration-form.component';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        resolve: { fetchedData: PortalUserResolver },
        component: CompleteRegistrationPageComponent,
        children: [],
      },
    ]),
    MfeBrokerMfeBrokerPortalSharedModule,
    MfeBrokerSharedUiModule,
  ],
  declarations: [CompleteRegistrationPageComponent, CompleteRegistrationFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPortalPagesCompleteRegistrationModule {}
