import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RunningaccountBalancemovementtype2distributiontypeComponent } from './components/runningaccount-balancemovementtype2distributiontype/runningaccount-balancemovementtype2distributiontype.component';
import { RunningaccountOwner2participantMappingComponent } from './components/runningaccount-owner2participant-mapping/runningaccount-owner2participant-mapping.component';
import { RunningaccountTxEl2BalMovTypeMappingComponent } from './components/runningaccount-tx-el2-bal-mov-type-mapping/runningaccount-tx-el2-bal-mov-type-mapping.component';
import { RunningaccountRunnAccBookingPlanComponent } from './components/runningaccount-runn-acc-booking-plan/runningaccount-runn-acc-booking-plan.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { TxEl2BalMovTypeResolver } from './components/runningaccount-tx-el2-bal-mov-type-mapping/resolver/tx-el2-bal-mov-type.resolver';
import { BalMov2DisTypeResolver } from './components/runningaccount-balancemovementtype2distributiontype/resolver/bal-mov2-dis-type.resolver';
import { RunnAccBookingPlanCodetableResolver } from './components/runningaccount-runn-acc-booking-plan/resolvers/runn-acc-booking-plan-codetable.resolver';
import { RunnAccBookingPlanResolver } from './components/runningaccount-runn-acc-booking-plan/resolvers/runn-acc-booking-plan.resolver';
import { Owner2participantResolver } from './components/runningaccount-owner2participant-mapping/Resolver/owner2participant.resolver';


const routes: Routes = [
  {
    path: '',
    component: RunningaccountBalancemovementtype2distributiontypeComponent,
    resolve: { balMov2DisTypeData: BalMov2DisTypeResolver }
  },
  {
    path: 'balancemovementtype2distributiontype',
    component: RunningaccountBalancemovementtype2distributiontypeComponent,
    resolve: { balMov2DisTypeData: BalMov2DisTypeResolver }
  },
  {
    path: 'owner2participantMapping',
    component: RunningaccountOwner2participantMappingComponent,
    resolve: { owner2participantData: Owner2participantResolver }
  },
  {
    path: 'txEl2BalMovTypeMapping',
    component: RunningaccountTxEl2BalMovTypeMappingComponent,
    resolve: { txEl2BalMovTypeData: TxEl2BalMovTypeResolver }
  },
  {
    path: 'runnAccBookingPlan',
    component: RunningaccountRunnAccBookingPlanComponent,
    resolve: { bookingPlanCodeTableData: RunnAccBookingPlanCodetableResolver, bookingPlanData: RunnAccBookingPlanResolver }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    SharedFluidControlsModule,
    TranslateModule  ],
  declarations: [
    RunningaccountBalancemovementtype2distributiontypeComponent,
    RunningaccountOwner2participantMappingComponent,
    RunningaccountTxEl2BalMovTypeMappingComponent,
    RunningaccountRunnAccBookingPlanComponent
  ],
  providers: [DatePipe]
})
export class MfeRunningaccountConfigServicePagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }



  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'runningaccount');
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
