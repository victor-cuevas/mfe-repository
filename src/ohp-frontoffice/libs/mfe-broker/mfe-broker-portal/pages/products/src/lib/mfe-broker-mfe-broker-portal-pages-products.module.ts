// Angular imports
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Shared imports
// Current module imports
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductsComponent } from './products.component';
import { MfeBrokerMfeBrokerPortalSharedModule } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';

@NgModule({
  imports: [
    CommonModule,
    MfeBrokerMfeBrokerPortalSharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductsComponent,
      },
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProductsComponent, ProductTableComponent],
})
export class MfeBrokerMfeBrokerPortalPagesProductsModule {}
