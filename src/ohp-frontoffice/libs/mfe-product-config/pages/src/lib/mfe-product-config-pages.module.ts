import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { SearchProductComponent } from './components/search-product/search-product.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { ManageCredMutationComponent } from './components/manage-cred-mutation/manage-cred-mutation.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { TranslateModule } from '@ngx-translate/core';
import { SearchProductResolver } from './components/search-product/Resolvers/search-product.resolver';
import { DepotProductComponent } from './components/depot-product/depot-product.component';
import { RelatedProductDefinitionComponent } from './components/related-product-definition/related-product-definition.component';
import { DepotPurposeProductComponent } from './components/depot-purpose-product/depot-purpose-product.component';
import { DepotProductResolver } from './components/depot-product/resolver/depot-product.resolver';
import { RelatedProductDefinitionResolver } from './components/related-product-definition/Resolver/related-product-definition.resolver';
import { CodeTableResolver } from './components/related-product-definition/Resolver/CodeTableResolver/code-table.resolver';
import { ManageCredMutationResolver } from './components/manage-cred-mutation/resolvers/manage-cred-mutation.resolver';
import { DepotPurposeProductResolver } from './components/depot-purpose-product/Resolvers/depot-purpose-product.resolver';
import { NewProductCodeTableResolver } from './components/new-product/Resolver/new-product-code-table.resolver';
import { ConfigContextService } from '@close-front-office/shared/config';
import { DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';
import { DepotTypeDataResolver } from './components/depot-product/resolver/depot-type-data.resolver';
import { CreditProviderResolver } from './components/depot-product/resolver/credit-provider.resolve';

const routes: Routes = [
  {
    path: '',
    component: SearchProductComponent,
    resolve:{searchProductData:SearchProductResolver}
  },
  {
    path: 'search-product',
    component: SearchProductComponent,
    resolve:{searchProductData:SearchProductResolver}
  },
  {
    path: 'new-product',
    component: NewProductComponent,
    resolve: {
      CodeTableResolver: NewProductCodeTableResolver
    }
  },
  
  {
    path: 'credit-mutation',
    component: ManageCredMutationComponent,
    resolve:{mutationData:ManageCredMutationResolver}
  },
  {
    path:'depot-product',
    component: DepotProductComponent,
    resolve: { depotProductData: DepotProductResolver, depotTypeData: DepotTypeDataResolver, creditProvider : CreditProviderResolver}
  },
  {
    path:'related-product-definition',
    component: RelatedProductDefinitionComponent,
    resolve:{InitialData:CodeTableResolver,relatedProductData:RelatedProductDefinitionResolver}
  },
  {
    path:'depot-purpose-product',
    component: DepotPurposeProductComponent,
    resolve :{depotPurposeData : DepotPurposeProductResolver}
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedFluidControlsModule,
    TranslateModule
  ],
  declarations: [
    SearchProductComponent,
    NewProductComponent,
    ManageCredMutationComponent,
    DepotProductComponent,
    RelatedProductDefinitionComponent,
    DepotPurposeProductComponent
  ],
  providers:[
    DatePipe,
    SearchProductResolver,
    DecimalTransformPipe
  ]
})
export class MfeProductConfigPagesModule {
  constructor(private configService: ConfigContextService) {
    this.loadStyles();
  }

  private loadStyles() {
    const mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'product');
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
