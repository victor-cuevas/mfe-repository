import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardPageComponent } from './dashboard-page.component';
import { MfeBrokerMfeBrokerPanelSharedModule } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardPageComponent,
        children: [],
      },
    ]),
    MfeBrokerMfeBrokerPanelSharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPanelPagesDashboardModule {}
