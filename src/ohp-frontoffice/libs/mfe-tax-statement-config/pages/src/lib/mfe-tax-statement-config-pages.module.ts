import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TaxcertificateCreditproviderComponent } from './components/taxcertificate-creditprovider/taxcertificate-creditprovider.component';
import { TaxcertificateTypemappingComponent } from './components/taxcertificate-typemapping/taxcertificate-typemapping.component';
import { TaxcertificateSystemconfigComponent } from './components/taxcertificate-systemconfig/taxcertificate-systemconfig.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { TaxcertificateCategoryResolver } from './components/taxcertificate-typemapping/Resolvers/taxcertificate-category.resolver';
import { TaxcertificateConfigtypeResolver } from './components/taxcertificate-typemapping/Resolvers/taxcertificate-configtype.resolver';
import { TaxcertificateTypemappingResolver } from './components/taxcertificate-typemapping/Resolvers/taxcertificate-typemapping.resolver';
import { TaxcertificateSystemconfigResolver } from './components/taxcertificate-systemconfig/Resolvers/taxcertificate-systemconfig.resolver';
import { TaxcertificateCommunicationmediumResolver } from './components/taxcertificate-systemconfig/Resolvers/taxcertificate-communicationmedium.resolver';
import { BalanceMovementTypeResolver } from './components/taxcertificate-creditprovider/Resolvers/balance-movement-type.resolver';
import { ConvertedTxTypeResolver } from './components/taxcertificate-creditprovider/Resolvers/converted-tx-type.resolver';
import { TaxCategoryResolver } from './components/taxcertificate-creditprovider/Resolvers/tax-category.resolver';
import { TaxCertificateResolver } from './components/taxcertificate-creditprovider/Resolvers/tax-certificate.resolver';
import { TaxConfigTypeResolver } from './components/taxcertificate-creditprovider/Resolvers/tax-config-type.resolver';
import { TaxConfigResolver } from './components/taxcertificate-creditprovider/Resolvers/tax-config.resolver';
import { TaxCreditProviderResolver } from './components/taxcertificate-creditprovider/Resolvers/tax-credit-provider.resolver';
import { TxElTypeResolver } from './components/taxcertificate-creditprovider/Resolvers/tx-el-type.resolver';
const routes: Routes = [
  {
    path: '',
    component: TaxcertificateCreditproviderComponent,
    resolve:{balancemovementList: BalanceMovementTypeResolver,
      convertedTxTypeList: ConvertedTxTypeResolver,
      taxCategoryList: TaxCategoryResolver,
      taxCertificateList: TaxCertificateResolver,
      taxConfigTypeList:TaxConfigTypeResolver,
      taxConfigData:TaxConfigResolver,
      taxCreditProviderList:TaxCreditProviderResolver,
      taxTxELList:TxElTypeResolver
    }
  },
  {
    path: 'tax-credit-provider',
    component: TaxcertificateCreditproviderComponent,
    resolve:{balancemovementList: BalanceMovementTypeResolver,
      convertedTxTypeList: ConvertedTxTypeResolver,
      taxCategoryList: TaxCategoryResolver,
      taxCertificateList: TaxCertificateResolver,
      taxConfigTypeList:TaxConfigTypeResolver,
      taxConfigData:TaxConfigResolver,
      taxCreditProviderList:TaxCreditProviderResolver,
      taxTxELList:TxElTypeResolver
    }
  },
  {
    path: 'tax-type-mapping',
    component: TaxcertificateTypemappingComponent,
    resolve:{taxCategoryList:TaxcertificateCategoryResolver,taxConfigTypeList:TaxcertificateConfigtypeResolver,taxcertificatetypeMapping:TaxcertificateTypemappingResolver}
  },
  {
    path: 'tax-system-config',
    component: TaxcertificateSystemconfigComponent,
    resolve:{taxCertificateSystemConfig:TaxcertificateSystemconfigResolver,communicationMedium:TaxcertificateCommunicationmediumResolver}
  },

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    SharedFluidControlsModule,
    TranslateModule],
  declarations: [TaxcertificateCreditproviderComponent, TaxcertificateTypemappingComponent, TaxcertificateSystemconfigComponent]
})
export class MfeTaxStatementConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }



  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'taxstatement');
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
