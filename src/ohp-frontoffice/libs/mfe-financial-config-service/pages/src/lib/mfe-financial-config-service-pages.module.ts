import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ManageDueAmountSortingComponent } from './components/manage-due-amount-sorting/manage-due-amount-sorting.component';
import { ManageValueReductionComponent } from './components/manage-value-reduction/manage-value-reduction.component';
import { ManageCostComponent } from './components/manage-cost/manage-cost.component';
import { ManageFeeConfigComponent } from './components/manage-fee-config/manage-fee-config.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { ManageCostResolver } from './components/manage-cost/resolver/manage-cost.resolver';
import { ManageDueAmountSortingResolver } from './components/manage-due-amount-sorting/Resolvers/manage-due-amount-sorting.resolver';
import { ValueReductionResolver } from './components/manage-value-reduction/Resolver/value-reduction.resolver';
import { DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';
import { FeeConfigResolver } from './components/manage-fee-config/Resolver/fee-config.resolver';

const routes: Routes = [
  {
    path: '',
    component: ManageDueAmountSortingComponent,
    resolve: { DueAmntSortingData: ManageDueAmountSortingResolver }
  },
  {
    path: 'due-amount-sorting',
    component: ManageDueAmountSortingComponent,
    resolve: { DueAmntSortingData: ManageDueAmountSortingResolver }
  },
  {
    path: 'value-reduction',
    component: ManageValueReductionComponent,
    resolve: { valueReductionData: ValueReductionResolver }
  },
  {
    path: 'manage-fee',
    component: ManageFeeConfigComponent,
    resolve: { feeConfigData: FeeConfigResolver }

  },
  {
    path: 'manage-cost',
    component: ManageCostComponent,
    resolve: { manageCostData: ManageCostResolver }
  }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    SharedFluidControlsModule,
    TranslateModule],
  declarations: [
    ManageDueAmountSortingComponent,
    ManageValueReductionComponent,
    ManageCostComponent,
    ManageFeeConfigComponent
  ],
  providers: [HttpClient, DatePipe, DecimalTransformPipe]
})
export class MfeFinancialConfigServicePagesModule {constructor(private configService: ConfigContextService) {
  this.loadStyles();
}

private loadStyles() {
  const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'financial');
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
}}
