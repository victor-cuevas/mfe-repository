import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MfeBrokerMfeBrokerPanelSharedModule } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import { MfeBrokerSharedUiModule, ProfilePageComponent } from '@close-front-office/mfe-broker/shared-ui';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

import { MbpanelProfileComponent } from './components/mbpanel-profile/mbpanel-profile.component';
import { MbpanelAccountComponent } from './components/mbpanel-account/mbpanel-account.component';
import { MbpanelAssistantsComponent } from './components/mbpanel-assistants/mbpanel-assistants.component';
import { MbpanelLinkedAdvisorsComponent } from './components/mbpanel-linked-advisors/mbpanel-linked-advisors.component';
import { MbpanelTradingAddressesComponent } from './components/mbpanel-trading-addresses/mbpanel-trading-addresses.component';
import { PanelUserResolver } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@NgModule({
  imports: [
    CommonModule,
    PanelMenuModule,
    TranslateModule,
    MenubarModule,
    MenuModule,
    MfeBrokerMfeBrokerPanelSharedModule,
    MfeBrokerSharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent,
        resolve: { intermediary: PanelUserResolver },
        children: [
          { path: '', redirectTo: 'edit', pathMatch: 'full' },
          { path: 'edit', component: MbpanelProfileComponent },
          { path: 'account', component: MbpanelAccountComponent },
          { path: 'assistants', component: MbpanelAssistantsComponent },
          { path: 'linked-advisors', component: MbpanelLinkedAdvisorsComponent },
          { path: 'trading-addresses', component: MbpanelTradingAddressesComponent },
        ],
      },
    ]),
  ],
  declarations: [
    MbpanelProfileComponent,
    MbpanelAccountComponent,
    MbpanelAssistantsComponent,
    MbpanelLinkedAdvisorsComponent,
    MbpanelTradingAddressesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPanelPagesProfileModule {}
