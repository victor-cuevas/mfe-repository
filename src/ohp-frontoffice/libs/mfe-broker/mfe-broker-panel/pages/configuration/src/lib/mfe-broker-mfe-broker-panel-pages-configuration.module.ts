import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfigurationPageComponent } from './configuration-page.component';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MfeBrokerMfeBrokerPanelSharedModule } from '@close-front-office/mfe-broker/mfe-broker-panel/shared';
import { ProcurationFeeConfigurationComponent } from './components/procuration-fee-configuration/procuration-fee-configuration.component';
import { ConfigurationMenuComponent } from './components/configuration-menu/configuration-menu.component';
import { GlobalSettingsConfigurationComponent } from './components/global-settings-configuration/global-settings-configuration.component';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';

@NgModule({
  declarations: [
    ConfigurationPageComponent,
    ProcurationFeeConfigurationComponent,
    ConfigurationMenuComponent,
    GlobalSettingsConfigurationComponent,
  ],
  imports: [
    CommonModule,
    PanelMenuModule,
    SidebarModule,
    MenuModule,
    MenubarModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConfigurationPageComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'procuration-fee/newlending',
          },
          {
            path: 'procuration-fee',
            children: [
              {
                path: '',
                redirectTo: 'newlending',
                pathMatch: 'full',
              },
              {
                path: 'newlending',
                component: ProcurationFeeConfigurationComponent,
              },
              {
                path: 'remortgage',
                component: ProcurationFeeConfigurationComponent,
              },
            ],
          },
          {
            path: 'global-settings',
            component: GlobalSettingsConfigurationComponent,
          },
        ],
      },
    ]),
    MfeBrokerMfeBrokerPanelSharedModule,
    MfeBrokerMfeBrokerPortalSharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerMfeBrokerPanelPagesConfigurationModule {}
