import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';
// Shared imports
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { NotFoundContentComponent } from './components/not-found-content/not-found-content.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotFoundPageComponent,
        children: [],
      },
    ]),
    MfeBrokerMfeBrokerPortalSharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [NotFoundPageComponent, NotFoundContentComponent],
})
export class MfeBrokerMfeBrokerPortalPagesNotFoundModule {}
