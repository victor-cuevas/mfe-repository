import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ManageTreatmentPlanConfigComponent } from './components/manage-treatment-plan-config/manage-treatment-plan-config.component';
import { ManageRemainderFlowConfigComponent } from './components/manage-remainder-flow-config/manage-remainder-flow-config.component';
import { ManageRemainderPlanConfigComponent } from './components/manage-remainder-plan-config/manage-remainder-plan-config.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { RuleEnginePlanDerivationConfigurationComponent } from './components/rule-engine-plan-derivation-configuration/rule-engine-plan-derivation-configuration.component';
import { ArrearsTriggerPlanComponent } from './components/arrears-trigger-plan/arrears-trigger-plan.component';
import { TreatmentPlanResolver } from './components/manage-treatment-plan-config/Resolver/treatment-plan.resolver';
import { RemainderFlowScreenDataResolver } from './components/manage-remainder-flow-config/resolver/remainder-flow-screen-data.resolver';
import { ReminderPlanResolver } from './components/manage-remainder-plan-config/Resolver/reminder-plan.resolver';
import { RuleEngineTreatmentPlanResolver } from './components/rule-engine-plan-derivation-configuration/Resolvers/rule-engine-treatment-plan.resolver';
import { RuleEngineReminderPlanResolver } from './components/rule-engine-plan-derivation-configuration/Resolvers/rule-engine-reminder-plan.resolver';
import { RuleEngineCostPlanResolver } from './components/rule-engine-plan-derivation-configuration/Resolvers/rule-engine-cost-plan.resolver';
import { RuleEnginePaymentAllocationPlanResolver } from './components/rule-engine-plan-derivation-configuration/Resolvers/rule-engine-payment-allocation-plan.resolver';
import { RuleEngineListResolver } from './components/rule-engine-plan-derivation-configuration/Resolvers/rule-engine-list.resolver';
import { GetArrearTriggerCalculationTypeListResolver } from './components/arrears-trigger-plan/Resolvers/get-arrear-trigger-calculation-type-list.resolver';
import { GetArrearTriggerContextListResolver } from './components/arrears-trigger-plan/Resolvers/get-arrear-trigger-context-list.resolver';
import { GetArrearTriggerPlanListResolver } from './components/arrears-trigger-plan/Resolvers/get-arrear-trigger-plan-list.resolver';
import { GetDebtSourceStatusListResolver } from './components/arrears-trigger-plan/Resolvers/get-debt-source-status-list.resolver';
import { GetFollowUpEventListResolver } from './components/arrears-trigger-plan/Resolvers/get-follow-up-event-list.resolver';
const routes: Routes = [
  {
    path: '',
    component: ManageTreatmentPlanConfigComponent,
    resolve: { TreatmentPlanData: TreatmentPlanResolver }
  },
  {
    path: 'treatment-plan',
    component: ManageTreatmentPlanConfigComponent,
    resolve: { TreatmentPlanData: TreatmentPlanResolver }
  },
  {
    path: 'reminder-plan',
    component: ManageRemainderPlanConfigComponent,
    resolve: { ReminderPlanData: ReminderPlanResolver }

  },
  {
    path: 'reminder-flow',
    component: ManageRemainderFlowConfigComponent,
    resolve: { RemainderFlowScreenData: RemainderFlowScreenDataResolver }
  },
  {
    path: 'rule-engine-plan-derivation',
    component: RuleEnginePlanDerivationConfigurationComponent,
    resolve: {
      treatmentPlan: RuleEngineTreatmentPlanResolver, reminderPlan: RuleEngineReminderPlanResolver,
      costPlan: RuleEngineCostPlanResolver, paymentAllocation: RuleEnginePaymentAllocationPlanResolver,
      ruleEngineData: RuleEngineListResolver
    }

  },
  {
    path: 'arrears-trigger-plan',
    component: ArrearsTriggerPlanComponent,
    resolve:{
      arrearTriggerCalculationList:GetArrearTriggerCalculationTypeListResolver,
      arrearTriggerContextList:GetArrearTriggerContextListResolver,
      arrearTriggerPlanList:GetArrearTriggerPlanListResolver,
      debtSourceStatusList:GetDebtSourceStatusListResolver,
      followUpEventList:GetFollowUpEventListResolver
    }
  }

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    SharedFluidControlsModule,
    TranslateModule],
  declarations: [ManageTreatmentPlanConfigComponent, ManageRemainderFlowConfigComponent, ManageRemainderPlanConfigComponent, RuleEnginePlanDerivationConfigurationComponent,
    ArrearsTriggerPlanComponent],

  providers: [HttpClient, DatePipe]
})
export class MfePlanConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'plan');
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
