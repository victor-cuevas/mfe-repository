import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PortalUserResolver } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { MfeBrokerSharedUiModule, ProfilePageComponent } from '@close-front-office/mfe-broker/shared-ui';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

import { MbportalProfileComponent } from './components/mbportal-profile/mbportal-profile.component';
import { MbportalAccountComponent } from './components/mbportal-account/mbportal-account.component';
import { MbportalAssistantsComponent } from './components/mbportal-assistants/mbportal-assistants.component';
import { MbportalLinkedAdvisorsComponent } from './components/mbportal-linked-advisors/mbportal-linked-advisors.component';
import { MbportalTradingAddressesComponent } from './components/mbportal-trading-addresses/mbportal-trading-addresses.component';

@NgModule({
  imports: [
    CommonModule,
    PanelMenuModule,
    TranslateModule,
    MenubarModule,
    MenuModule,
    MfeBrokerMfeBrokerPortalSharedModule,
    MfeBrokerSharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent,
        resolve: { intermediary: PortalUserResolver },
        children: [
          { path: '', redirectTo: 'edit', pathMatch: 'full' },
          { path: 'edit', component: MbportalProfileComponent },
          { path: 'account', component: MbportalAccountComponent },
          { path: 'assistants', component: MbportalAssistantsComponent },
          { path: 'linked-advisors', component: MbportalLinkedAdvisorsComponent },
          { path: 'trading-addresses', component: MbportalTradingAddressesComponent },
        ],
      },
    ]),
  ],
  declarations: [
    MbportalProfileComponent,
    MbportalAccountComponent,
    MbportalAssistantsComponent,
    MbportalLinkedAdvisorsComponent,
    MbportalTradingAddressesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPortalPagesProfileModule {}
