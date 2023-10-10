import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreditProviderConfigComponent } from './components/credit-provider-config/credit-provider-config.component';
import { DivergentEffectiveRatesheetComponent } from './components/divergent-effective-ratesheet/divergent-effective-ratesheet.component';
import { MutationTypeConfigComponent } from './components/mutation-type-config/mutation-type-config.component';
import { PeriodicityConfigComponent } from './components/periodicity-config/periodicity-config.component';
import { TxtypeConfigComponent } from './components/txtype-config/txtype-config.component';
import { InterestMediationSurchargeComponent } from './components/interest-mediation-surcharge/interest-mediation-surcharge.component';
import { LtvModificationSurchargesComponent } from './components/ltv-modification-surcharges/ltv-modification-surcharges.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { CreditProviderResolver } from './components/credit-provider-config/resolvers/creditproviderconfigforaccountingmodule.resolver';
import { FinancialAmortizationTypeListResolver } from './components/credit-provider-config/resolvers/financial-amortizationtype-list.resolver';
import { CreditProvidernameListResolver } from './components/credit-provider-config/resolvers/credit-providername-list.resolver';
import { PeriodicityNameListResolver } from './components/periodicity-config/resolvers/periodicity-list.resolver';
import { PeriodicityResolver } from './components/periodicity-config/resolvers/periodicityconfigforaccountingmodule.resolver';
import { FinancialAmortizationTypeListResolvers } from './components/periodicity-config/resolvers/financial-amortizationtype-list.resolver';
import { DivergentEffectiveRateResolver } from './components/divergent-effective-ratesheet/Resolvers/divergenteffectiveratesheet.resolver';
import { MutationTypeNameListResolver } from './components/mutation-type-config/Resolvers/mutationtype-list-resolver';
import { MutationTypeResolver } from './components/mutation-type-config/Resolvers/mutationtypeconfigforaccountingmodule.resolver';
import { DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';
import { TxTypeNameListResolver } from './components/txtype-config/Resolvers/txtype-list-resolver';
import { TxTypeResolver } from './components/txtype-config/Resolvers/txtypeconfig.resolver';
import { InterestMediationResolver } from './components/interest-mediation-surcharge/Resolver/interest-mediation.resolver';
import { RateAdaptationNameResolver } from './components/interest-mediation-surcharge/Resolver/rate-adaptation-name.resolver';
import { LtvModificationResolver } from './components/ltv-modification-surcharges/Resolvers/ltv-modification.resolver';
import { LtvRateAdaptationResolver } from './components/ltv-modification-surcharges/Resolvers/ltv-rate-adaptation.resolver';
import { ForbearanceMeasureComponent } from './components/forbearance-measure/forbearance-measure.component';
import { ForbearanceMeasureResolver } from './components/forbearance-measure/resolvers/forbearance-measure.resolver';
import { ForbearanceMeasureTypeResolver } from './components/forbearance-measure/resolvers/forbearance-measure-type.resolver';
import { MarketrateForSubstantialModificationComponent } from './components/marketrate-for-substantial-modification/marketrate-for-substantial-modification.component';
import { MarketRateForSubstantialModificationResolver } from './components/marketrate-for-substantial-modification/Resolver/market-rate-for-substantial-modification.resolver';

const routes: Routes = [
  {
    path: '',
    component: CreditProviderConfigComponent,
    resolve: {
      creditProviderData: CreditProviderResolver,
      financialAmortizationTypeList: FinancialAmortizationTypeListResolver,
      creditProviderList: CreditProvidernameListResolver
    }
  },
  {
    path: 'credit-provider',
    component: CreditProviderConfigComponent,
    resolve: {
      creditProviderData: CreditProviderResolver,
      financialAmortizationTypeList: FinancialAmortizationTypeListResolver,
      creditProviderList: CreditProvidernameListResolver
    }
  },
  {
    path: 'divergent-effective',
    component: DivergentEffectiveRatesheetComponent,
    resolve: { divergentEffectiveRateData: DivergentEffectiveRateResolver }
  },
  {
    path: 'mutation-type',
    component: MutationTypeConfigComponent,
    resolve: { mutationtypeData: MutationTypeResolver, mutationTypeList: MutationTypeNameListResolver }
  },
  {
    path: 'periodicity-config',
    component: PeriodicityConfigComponent,
    resolve: {
      periodicityData: PeriodicityResolver,
      financialAmortizationTypeList: FinancialAmortizationTypeListResolvers,
      periodicityList: PeriodicityNameListResolver
    }
  },
  {
    path: 'txtype-config',
    component: TxtypeConfigComponent,
    resolve: { txTypeData: TxTypeResolver, txTypeList: TxTypeNameListResolver }
  },
  {
    path: 'interest-mediation',
    component: InterestMediationSurchargeComponent,
    resolve: { InterestMediationData: InterestMediationResolver, rateAdaptationData: RateAdaptationNameResolver }
  },
  {
    path: 'ltv-modification',
    component: LtvModificationSurchargesComponent,
    resolve: { LtvModificationData: LtvModificationResolver, ltvRateAdaptationData: LtvRateAdaptationResolver }
  },
  {
    path: 'forbearance-measure',
    component: ForbearanceMeasureComponent,
    resolve: { ForbearanceMeasureData: ForbearanceMeasureResolver, ForbearanceMeasureTypeList: ForbearanceMeasureTypeResolver }
  },
  {
    path: 'marketrate-for-substantial-modification',
    component: MarketrateForSubstantialModificationComponent,
    resolve: { marketRateData: MarketRateForSubstantialModificationResolver }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedFluidControlsModule, TranslateModule],
  declarations: [
    CreditProviderConfigComponent,
    DivergentEffectiveRatesheetComponent,
    MutationTypeConfigComponent,
    PeriodicityConfigComponent,
    TxtypeConfigComponent,
    InterestMediationSurchargeComponent,
    LtvModificationSurchargesComponent,
    ForbearanceMeasureComponent,
    MarketrateForSubstantialModificationComponent
  ],
  providers: [DecimalTransformPipe, DatePipe]
})
export class MfeAccountingConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'accounting');
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
