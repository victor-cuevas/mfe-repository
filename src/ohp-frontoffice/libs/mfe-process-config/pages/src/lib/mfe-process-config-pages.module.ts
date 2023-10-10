import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManageNotificationConfigComponent } from './component/manage-notification-config/manage-notification-config.component';
import { ManageRemainderScenarioComponent } from './component/manage-remainder-scenario/manage-remainder-scenario.component';
import { EventConfigComponent } from './component/event-config/event-config.component';
import { FollowupEventConfigComponent } from './component/followup-event-config/followup-event-config.component';
import { ManageFollowupConfigComponent } from './component/manage-followup-config/manage-followup-config.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ManageNotificationConfigResolver } from './component/manage-notification-config/Resolvers/manage-notification-config.resolver';
import { ManageFollowupResolver } from './component/manage-followup-config/resolver/manage-followup.resolver';
import { FollowUpEventResolver } from './component/followup-event-config/Resolver/follow-up-event-resolver.resolver';
import { EventDateResolver } from './component/followup-event-config/Resolver/event-date-resolver.resolver';
import { EventNameResolver } from './component/followup-event-config/Resolver/event-name-resolver.resolver';
import { ManageRemainderScenarioResolver } from './component/manage-remainder-scenario/Resolver/manage-remainder-scenario.resolver';
import { EventConfigResolver } from './component/event-config/Resolvers/event-config.resolver';
import { ServiceActionNameResolver } from './component/event-config/Resolvers/service-action-name.resolver';
import { FollowUpEventNameResolver } from './component/event-config/Resolvers/follow-up-event-name.resolver';
import { ConfigContextService } from '@close-front-office/shared/config';
import { FollowupCase2DunningDossierComponent } from './component/followup-case2-dunning-dossier/followup-case2-dunning-dossier.component';
import { FollowupEventConfigurationComponent } from './component/followup-event-configuration/followup-event-configuration.component';
import { EventConfigurationComponent } from './component/event-configuration/event-configuration.component';
import { EventDateTypeResolver } from './component/followup-event-configuration/Resolvers/event-date-type.resolver';
import { FollowUpEventConfigurationResolver } from './component/followup-event-configuration/Resolvers/follow-up-event-configuration.resolver';
import {FollowUpEventNameConfigResolver} from './component/followup-event-configuration/Resolvers/follow-up-event-name.resolver'
import { EventConfigurationResolver } from './component/event-configuration/Resolvers/event-configuration.resolver';
import { FollowupEventNameResolver } from './component/event-configuration/Resolvers/followup-event-name.resolver';
import { ServiceActionNameEventResolver } from './component/event-configuration/Resolvers/service-action-name.resolver';
import { GetDossierStatusResolver } from './component/followup-case2-dunning-dossier/Resolvers/get-dossier-status.resolver';
import { GetFollowUpCaseStatusResolver } from './component/followup-case2-dunning-dossier/Resolvers/get-follow-up-case-status.resolver';
import { GetFollowUpCaseStatusDunningDossierStatusResolver } from './component/followup-case2-dunning-dossier/Resolvers/get-follow-up-case-status-dunning-dossier-status.resolver';
const routes: Routes = [
  {
    path: '',
    component: EventConfigComponent,
    resolve: {
      EventConfigData: EventConfigResolver,
      eventNameData: FollowUpEventNameResolver,
      serviceActionData: ServiceActionNameResolver
    }
  },
  {
    path: 'event-config',
    component: EventConfigComponent,
    resolve: {
      EventConfigData: EventConfigResolver,
      eventNameData: FollowUpEventNameResolver,
      serviceActionData: ServiceActionNameResolver
    }
  },
  {
    path: 'followup-event-config',
    component: FollowupEventConfigComponent,
    resolve: { followUpEventConfigData: FollowUpEventResolver, eventDateTypeData: EventDateResolver, eventNameData: EventNameResolver }
  },
  {
    path: 'manage-followup-config',
    component: ManageFollowupConfigComponent,
    resolve: { followUpScreenData: ManageFollowupResolver }
  },
  {
    path: 'manage-notification-config',
    component: ManageNotificationConfigComponent,
    resolve: { notificationData: ManageNotificationConfigResolver }
  },
  {
    path: 'manage-reminder-scenario',
    component: ManageRemainderScenarioComponent,
    resolve: { remainderScenarioData: ManageRemainderScenarioResolver }
  },
  {
    path: 'event-configuration',
    component: EventConfigurationComponent,
    resolve:{eventConfigList:EventConfigurationResolver,followUpEventList:FollowupEventNameResolver,serviceActionList:ServiceActionNameEventResolver}
  },
  {
    path: 'followup-case2-dunning-dossier',
    component: FollowupCase2DunningDossierComponent,
    resolve:{dossierStatusList:GetDossierStatusResolver,followupCaseStatus:GetFollowUpCaseStatusResolver,followupDunningList:GetFollowUpCaseStatusDunningDossierStatusResolver}
  },
  {
    path: 'followup-event-configuration',
    component: FollowupEventConfigurationComponent,
    resolve:{eventDateList: EventDateTypeResolver,followUpConfigList:FollowUpEventConfigurationResolver,followUpEventNameList:FollowUpEventNameConfigResolver}
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedFluidControlsModule, TranslateModule],
  declarations: [
    ManageNotificationConfigComponent,
    ManageRemainderScenarioComponent,
    EventConfigComponent,
    FollowupEventConfigComponent,
    ManageFollowupConfigComponent,
    FollowupCase2DunningDossierComponent,
    FollowupEventConfigurationComponent,
    EventConfigurationComponent
  ],
  providers: [DatePipe, HttpClient]
})
export class MfeProcessConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process');
    if (mfeConfig) {
      const el = document.getElementById('whitelabel-config-styles');

      if (!el) {
        const headEl = document.getElementsByTagName('head')[0];
        const styleLinkEl = document.createElement('link');
        styleLinkEl.rel = 'stylesheet';
        styleLinkEl.id = 'whitelabel-config-styles';
        styleLinkEl.href = `${mfeConfig.remoteUrl}/whitelabel-config-styles.css`;
        headEl.appendChild(styleLinkEl);
      }
    }
  }
}
