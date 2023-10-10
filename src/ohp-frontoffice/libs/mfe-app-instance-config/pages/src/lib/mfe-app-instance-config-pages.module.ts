import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManageIntegrationComponent } from './components/manage-integration/manage-integration.component';
import { ManageCreditProviderComponent } from './components/manage-credit-provider/manage-credit-provider.component';
import { ManageLegislationComponent } from './components/manage-legislation/manage-legislation.component';
import { GeneralComponent } from './components/general/general.component';
import { RevisionPeriodDefinitionComponent } from './components/revision-period-definition/revision-period-definition.component';
import { PrepaymentReasonComponent } from './components/prepayment-reason/prepayment-reason.component';
import { RouterModule, Routes } from '@angular/router';
import { FluidFormatIBANPipe, SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { GenericMappingComponent } from './components/generic-mapping/generic-mapping.component';
import { ManageIntegrationResolver } from './components/manage-integration/resolver/manage-integration.resolver';

import { GeneralResolver } from './components/general/Resolver/general-resolver.resolver';
import { PrepaymentReasonResolver } from './components/prepayment-reason/Resolver/prepayment-reason-resolver.resolver';
import { RevisionPeriodResolver } from './components/revision-period-definition/Resolver/revision-period-resolver.resolver';
import { ConfigContextService } from '@close-front-office/shared/config';
import { GenericMappingResolver } from './components/generic-mapping/resolvers/generic-mapping.resolver';
import { MappingContextListResolver } from './components/generic-mapping/resolvers/mapping-context-list.resolver';
import { MappingDirectionListResolver } from './components/generic-mapping/resolvers/mapping-direction-list.resolver';
import { CreditProvidernameListResolver } from './components/generic-mapping/resolvers/credit-providername-list.resolver';
import { ManageLegislationResolver } from './components/manage-legislation/Resolvers/manage-legislation.resolver';
import { ConsumerProductResolver } from './components/manage-legislation/Resolvers/consumer-product.resolver';
import { HttpClient } from '@angular/common/http';
import { CreditProviderResolver } from './components/manage-credit-provider/resolver/credit-provider.resolver';
import { BICCodeDataResolver } from './components/manage-credit-provider/resolver/biccode-data.resolver';
import { CountryDataResolver } from './components/manage-credit-provider/resolver/country-data.resolver';
import { CreditProviderRefDataResolver } from './components/manage-credit-provider/resolver/credit-provider-ref-data.resolver';
import { GenericMappingCmComponent } from './components/generic-mapping-cm/generic-mapping-cm.component';
import { CodeTableParameteComponent } from './components/code-table-paramete/code-table-paramete.component';
import { RoleTypeComponent } from './components/role-type/role-type.component';
import { GetGenericMappingCodetableResolver } from './components/generic-mapping-cm/resolvers/get-generic-mapping-codetable.resolver';
import { GetGenericMappingResolver } from './components/generic-mapping-cm/resolvers/get-generic-mapping.resolver';
import { RoleTypeCodeTablesResolver } from './components/role-type/Resolvers/role-type-code-tables.resolver';
import { RoleTypeListResolver } from './components/role-type/Resolvers/role-type-list.resolver';
import { CodeTableParamListResolver } from './components/code-table-paramete/Resolvers/code-table-param-list.resolver';
import { CodeTableNameListResolver } from './components/code-table-paramete/Resolvers/code-table-name-list.resolver';
import { FreeFieldConfigComponent } from './components/free-field-config/free-field-config.component';
import { FreeFieldConfigCodeTableResolver } from './components/free-field-config/resolvers/free-field-config-code-table.resolver';
import { FreeFieldConfigResolver } from './components/free-field-config/resolvers/free-field-config.resolver';
import { ArrearsConfigurationComponent } from './components/arrears-configuration/arrears-configuration.component';
import { ArrearsConfigListResolver } from './components/arrears-configuration/Resolvers/arrears-config-list.resolver';
import { TxelTypeListResolver } from './components/arrears-configuration/Resolvers/txel-type-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: ManageIntegrationComponent,
    resolve: { manageIntegrationData: ManageIntegrationResolver }
  },
  {
    path: 'manage-integration',
    component: ManageIntegrationComponent,
    resolve: { manageIntegrationData: ManageIntegrationResolver }
  },
  {
    path: 'manage-credit-provider',
    component: ManageCreditProviderComponent,
    resolve: {
      creditProviderData: CreditProviderResolver,
      bicCodeData: BICCodeDataResolver,
      CountryData: CountryDataResolver,
      CreditProviderRefData: CreditProviderRefDataResolver
    }
  },
  {
    path: 'manage-legislation',
    component: ManageLegislationComponent,
    resolve: { legislationData: ManageLegislationResolver, consumerProductData: ConsumerProductResolver }
  },
  {
    path: 'manage-rate-revision',
    component: GeneralComponent,
    resolve: { creditSettingData: GeneralResolver }
  },
  {
    path: 'revision-period-definition',
    component: RevisionPeriodDefinitionComponent,
    resolve: { revisionPeriodData: RevisionPeriodResolver }
  },
  {
    path: 'prepayment-reason',
    component: PrepaymentReasonComponent,
    resolve: { prePaymentReasonData: PrepaymentReasonResolver }
  },
  {
    path: 'generic-mapping',
    component: GenericMappingComponent,
    resolve: {
      genericMappingData: GenericMappingResolver,
      contextList: MappingContextListResolver,
      directionList: MappingDirectionListResolver,
      creditProviderList: CreditProvidernameListResolver
    }
  },
  {
    path: 'free-field-config',
    component: FreeFieldConfigComponent,
    resolve: {
      freeFieldScreenData: FreeFieldConfigCodeTableResolver,
      freeFieldData: FreeFieldConfigResolver
    }
  },
  {
    path: 'code-table-parameter',
    component: CodeTableParameteComponent,
    resolve: { getCodetableParamList: CodeTableParamListResolver, getCodetableNameList: CodeTableNameListResolver }
  },
  {
    path: 'generic-mapping-cm',
    component: GenericMappingCmComponent,
    resolve: {
      getGenericMappingCodetabl: GetGenericMappingCodetableResolver,
      getGenericMapping: GetGenericMappingResolver
    }
  },
  {
    path: 'role-type',
    component: RoleTypeComponent,
    resolve: { codeTableData: RoleTypeCodeTablesResolver, roleTypeListData: RoleTypeListResolver }
  },
  {
    path:'arrears-configuration',
    component:ArrearsConfigurationComponent,
    resolve:{arrearConfigList:ArrearsConfigListResolver, txelList:TxelTypeListResolver}
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedFluidControlsModule, TranslateModule],
  declarations: [
    ManageIntegrationComponent,
    ManageCreditProviderComponent,
    ManageLegislationComponent,
    GeneralComponent,
    RevisionPeriodDefinitionComponent,
    PrepaymentReasonComponent,
    GenericMappingComponent,
    GenericMappingCmComponent,
    CodeTableParameteComponent,
    RoleTypeComponent,
    FreeFieldConfigComponent,
    ArrearsConfigurationComponent
  ],
  providers: [DatePipe, HttpClient, FluidFormatIBANPipe]
})
export class MfeAppInstanceConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'appinstance');
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
